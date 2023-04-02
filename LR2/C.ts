import axios from 'axios'

const PORT: number = 3000
const AS_URL: string = 'http://localhost:4000'

const main = async (): Promise<void> => {
    const testUser: string = 'user555' // с

    const {data} = await axios.get(`${AS_URL}?user=${testUser}`)

    console.log(data)
}


main()