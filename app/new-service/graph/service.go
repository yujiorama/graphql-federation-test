package graph

import (
	"context"

	"yujiorama.github.io/graphql-federation-test/app/new-service/datasource"
	"yujiorama.github.io/graphql-federation-test/app/new-service/datasource/dao"
	"yujiorama.github.io/graphql-federation-test/app/new-service/graph/model"
)

func FindItemByID(ctx context.Context, id string) (*model.Item, error) {
	db := datasource.DBFromContext(ctx)
	q := dao.Use(db)
	row, err := q.Item.WithContext(ctx).Where(q.Item.ID.Eq(id)).First()
	if err != nil {
		return nil, err
	}

	itemNumber := row.Price
	return &model.Item{
		ID:     row.ID,
		Number: &itemNumber,
	}, nil
}
