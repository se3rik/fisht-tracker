export type Commentary = {
    id: string;
    text: string;
    taskId: string;
    authorId: string;
    createdAt: string;
    updatedAt: string;
    author: {
        id: string;
        firstName: string;
        secondName: string;
    };
};
