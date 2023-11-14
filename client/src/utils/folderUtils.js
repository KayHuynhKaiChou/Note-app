import { graphQL_Request } from "./request"

export const foldersLoader = async () => {
    const query = `
        query Folders {
            folders {
                id
                name
                createdAt
            }
        }
    `
    const data = await graphQL_Request({ query });
    return data
}

export const addNewFolder = async ({name}) => {
    const query = `mutation addNewFolder($name: String!){
        addFolder(name : $name){
            name
            author{
                name
            }
        }
    }`

    const data = graphQL_Request({
        query,
        variables: {
            name
        }
    })

    return data;
}