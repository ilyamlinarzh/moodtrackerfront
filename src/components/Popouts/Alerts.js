import { back, block, go, push, replace, useDeserialized, useLocation, useParams } from "@itznevikat/router"
import { Alert } from "@vkontakte/vkui"
import { useEffect } from "react"
import { useStorage } from "../../hooks/useStorage"
import { api } from "../../server"
import { Snack } from "../Snack/Snack"


export const RemoveBookAlert = () => {
    
    let {
        setScreenSpinner,
        activeBooks, setActiveBooks,
        choisedBooks, setChoisedBooks,
        setSnackbar
    } = useStorage()

    const {
        id: book_id
    } = useParams()

    const removeBook = async () => {
        replace(`/editbook?id=${book_id}&popout=fetching`)
        const unblock = block()
        let remove_req = await api('remove_book', {book_id:book_id}).catch((err)=>console.log(err))

        if(remove_req.code == 200){
            setActiveBooks(activeBooks.filter(book=>book.book_id!=book_id))
            setChoisedBooks(choisedBooks.filter(bid=>bid!=book_id))
            setSnackbar(<Snack mode="ok">Дневник был удалён</Snack>, 'removebook')
        }else{
            setSnackbar(<Snack mode='error'>Не удалось удалить дневник</Snack>, 'removebook')
        }
        unblock()
        go(-3)
    }

    return (
        <Alert
        onClose={back}
        actionsLayout='vertical'
        actions={[
            {
                title: 'Удалить дневник',
                mode: 'destructive',
                // autoClose: true,
                action: removeBook
              },
              {
                title: 'Отмена',
                autoClose: true,
                mode: 'cancel',
              },
        ]}
        header='Подтвердите удаление'
        text='Вы действительно хотите удалить этот дневник? Участники будут изгнаны, и все записи будут безвозвратно удалены'
        />
    )
}

export const RemovePostAlert = () => {

    let {
        setSnackbar, ReloadJournal,
        setScreenSpinner
    } = useStorage()

    const {
        id: post_id
    } = useParams()


    const removePost = async () => {
        replace(`/post?id=${post_id}&popout=fetching`)
        const unblock = block()
        let remove_req = await api('remove_post', {post_id:post_id}).catch((err)=>{
            console.log(err)
            unblock()
        })

        unblock()
        if(remove_req.code == 200){
            await ReloadJournal(false)
            go(-2)
            setSnackbar(<Snack mode='ok'>Запись была удалена</Snack>, 'removepost')
        }
    }

    return(
        <Alert 
        onClose={back}
        actionsLayout='vertical'
        actions={[
            {
                title: 'Удалить запись',
                mode: 'destructive',
                // autoClose: true,
                action: removePost
              },
              {
                title: 'Отмена',
                autoClose: true,
                mode: 'cancel',
              },
        ]}
        header='Подтвердите удаление'
        text='Вы действительно хотите удалить эту запись?'
        />
    )
}