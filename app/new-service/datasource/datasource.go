package datasource

import (
	"log"
	"os"
	"sync"
	"time"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

type Item struct {
	ID    string `gorm:"primaryKey;column:id"`
	Name  string `gorm:"column:name"`
	Value string `gorm:"column:value"`
	Price int    `gorm:"column:price"`
}

var (
	dbOnce sync.Once
	dbInst *gorm.DB
	dbErr  error
)

func NewDB() (*gorm.DB, error) {
	dbOnce.Do(func() {
		dsn := os.Getenv("DATABASE_URL")
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
