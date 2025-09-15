package main

import (
	"log"
	"os"
	"path/filepath"

	"gorm.io/driver/sqlite"
	"gorm.io/gen"
	"gorm.io/gorm"
	"gorm.io/gorm/schema"
)

func main() {
	dsn := os.Getenv("DSN")
	if dsn == "" {
		log.Fatalf("DSN is not set")
	}

	db, err := gorm.Open(sqlite.Open(dsn), &gorm.Config{
		NamingStrategy: schema.NamingStrategy{
			SingularTable: true,
		},
	})
	if err != nil {
		log.Fatalf("failed to connect database: %v", err)
	}

	wd, err := os.Getwd()
	if err != nil {
		log.Fatalf("failed to get working directory: %v", err)
	}
	log.Printf("working directory: %s", wd)

	g := gen.NewGenerator(gen.Config{
		OutPath:      filepath.Join(wd, "dao"),
		ModelPkgPath: filepath.Join(wd, "model"),
		Mode:         gen.WithoutContext | gen.WithDefaultQuery | gen.WithQueryInterface,
	})

	g.UseDB(db)

	allowedTables := []string{
		"item",
		"tag",
		"ad_image",
		"ad_link",
		"item_ad_images",
		"item_ad_links",
		"item_categories",
		"item_tags",
	}

	var models []interface{}
	for _, tbl := range allowedTables {
		models = append(models, g.GenerateModel(tbl))
	}

	g.ApplyBasic(models...)

	g.Execute()
}
