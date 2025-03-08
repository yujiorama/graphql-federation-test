package graph

import "yujiorama.github.io/graphql-federation-test/app/new-service/graph/model"

func FindItemByID(id string) (*model.Item, error) {
	number := int32(987)
	return &model.Item{
		ID:     id,
		Number: &number,
	}, nil
}
