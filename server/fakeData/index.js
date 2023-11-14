export default {
    authors: [
        {
            id: 123,
            name: 'HoleTex'
        },
        {
            id: 999,
            name: 'Tung Nguyen'
        }
    ],
    folders: [
        {
            id: "1",
            name: 'disaster',
            createdAt: '2022-11-18T03:42:13Z',
            authorId: 123,
        },
        {
            id: "2",
            name: 'optimistic',
            createdAt: '2022-10-18T03:42:13Z',
            authorId: 999,
        },
        {
            id: "3",
            name: 'rare',
            createdAt: '2022-09-18T03:42:13Z',
            authorId: 123,
        },
    ],
    notes: [
        {
            id: "N1",
            content: '<p>It would be a disaster for me if I lost my job.</p>',
            folderId: "1"
        },
        {
            id: "N2",
            content: '<p>She is optimistic about her chances of winning a gold medal.</p>',
            folderId: "2"
        },
        {
            id: "N3",
            content: '<p>The museum is full of rare and precious treasures.</p>',
            folderId: "3"
        },
        {
            id: "N4",
            content: '<p>really rare</p>',
            folderId: "3"
        }
    ]
}