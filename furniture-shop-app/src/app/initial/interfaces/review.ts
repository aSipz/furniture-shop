export interface IReview {
    _id: string;
    text: string;
    createdAt: string;
    updatedAt: string;
    ownerId: {
        _id: string;
        firstName: string;
        lastName: string
    };
    productId: string;
    likes: string[]
}