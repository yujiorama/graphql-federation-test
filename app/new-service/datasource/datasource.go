package datasource

import (
	"context"
	"log"
	"os"
	"sync"
	"time"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var (
	dbOnce sync.Once
	dbInst *gorm.DB
	dbErr  error
)

// DbContextKey is a unique key used to store and retrieve database context values within a Go context.
var (
	DbContextKey struct{}
)

// NewDB initializes and returns a singleton instance of *gorm.DB configured for SQLite with optional DSN from environment.
// It ensures thread safety using sync.Once and sets SQLite-specific configurations such as WAL mode and foreign keys.
// Returns the database instance or an error if the connection fails.
func NewDB() (*gorm.DB, error) {
	dbOnce.Do(func() {
		dsn := os.Getenv("DSN")
		if dsn == "" {
			// compose.yaml で /data/app.db を渡す前提。未設定時はローカル用にメモリも可
			dsn = "/data/app.db"
		}
		cfg := &gorm.Config{
			Logger: logger.New(
				log.New(os.Stdout, "[gorm] ", log.LstdFlags),
				logger.Config{
					SlowThreshold:             500 * time.Millisecond,
					LogLevel:                  logger.Warn,
					IgnoreRecordNotFoundError: true,
				},
			),
		}
		dbInst, dbErr = gorm.Open(sqlite.Open(dsn), cfg)
		if dbErr != nil {
			return
		}

		// SQLite 推奨の WAL モード（共有アクセスの相性良）
		dbInst.Exec("PRAGMA journal_mode=WAL;")
		dbInst.Exec("PRAGMA foreign_keys=ON;")
	})
	return dbInst, dbErr
}

// DBFromContext retrieves the *gorm.DB instance from the provided context if available; returns nil otherwise.
func DBFromContext(ctx context.Context) *gorm.DB {
	if v := ctx.Value(DbContextKey); v != nil {
		if db, ok := v.(*gorm.DB); ok {
			return db
		}
	}
	return nil
}
