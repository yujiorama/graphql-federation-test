package graph

import (
	"yujiorama.github.io/graphql-federation-test/app/new-service/datasource"
	"yujiorama.github.io/graphql-federation-test/app/new-service/graph/model"
)

func FindItemByID(id string) (*model.Item, error) {
	db, err := datasource.NewDB()
	if err != nil {
		return nil, err
	}

	var item datasource.Item
	tx := db.First(&item, "id = ?", id)
	if tx.Error != nil {
		return nil, tx.Error
	}

	return &model.Item{
		ID:     item.ID,
		Number: int32Ptr(&item.Price),
	}, nil
}

func int32Ptr(i *int) *int32 {
	v := int32(*i)
	return &v
}
