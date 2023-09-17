import axios from 'axios'
export function insert({
    mId, hash1, hash2
}: { mId: string, hash1: string, hash2: string }) {
    return axios.post('http://localhost:5000/api/insertRecord', {
        mId, hash1, hash2
    })
}
export function getHash(mId :string) {
    return axios.get('http://localhost:5000/api/getHashByMId?mId=' + mId )
}