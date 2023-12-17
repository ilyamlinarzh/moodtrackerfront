export const server = 'https://moodjournal.326studio.ru/'
// export const server = 'https://127.0.0.1:10888/'

export const api = (path, body={}) => {
    return new Promise(async (resolve, reject)=>{
        let c_req = await fetch(`${server}${path}`, {
            method:'POST',
            // mode:'cors',
            // headers:{'Content-Type':'application/json;charset=utf-8'},
            body:JSON.stringify({
                sign:window.location.search,
                ...body
            })
        })
        .then((res)=>resolve(res.json()))
        .catch((err)=>reject(err))
    })
}

export const upload = (photo) => {
    return new Promise(async (resolve, reject)=>{

        var formdata = new FormData()
        formdata.append('photo', photo.files[0])
        formdata.append('sign', window.location.search)

        let upload_req = await fetch(`${server}upload`, {
            method:'POST',
            body:formdata,
            redirect:'follow'
        })
        .then((res)=>resolve(res.json()))
        .catch((err)=>reject(err))
    })
}