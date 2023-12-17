import { ScreenSpinner, useAdaptivityConditionalRender, usePlatform } from "@vkontakte/vkui";
import { createContext } from "react";
import { useState } from "react";
import { api } from "../server";
import { block, replace, useParams } from "@itznevikat/router";

export const current_storage = createContext()

export const StorageProvider = ({children}) => {
    const [initFetch, setInitFetch] = useState(true)

    const [init, setInit] = useState(null)
    const [vkUser, setVkUser] = useState(null)

    const [activeBooks, setActiveBooks] = useState([])
    const [choisedBooks, setChoisedBooks] = useState([])

    const [currentPosts, setCurrentPosts] = useState([])
    const [currentPostsPage, setCurrentPostsPage] = useState(0)

    const [snackbar, setSnackbar_state] = useState({snack:null, name:null})
    const [popout, setPopout] = useState(<ScreenSpinner size = 'large' />)

    const [currentEditBook, setCurrentEditBook] = useState(null)

    const [creatingPost, setCreatingPost] = useState(null)

    const [publicBookPosts, setPublicBookPosts] = useState(null)

    const platform = new URLSearchParams(
        window.location.search
      ).get('vk_platform')
    
    const isDesktop = platform === 'desktop_web'

    const setScreenSpinner = () => {
        
        const hash = window.location.hash.slice(1)
        const hash_with_spinner = hash.includes('?') ? `${hash}&popout=fetching` : `${hash}?popout=fetching`
        replace(hash_with_spinner)
        const unblock = block(()=>void 0)

        return ()=>{
            unblock()
            replace(hash)
        }
    }

    const ReloadJournal = async (withSpinner=true, books=choisedBooks) => {
        let unblock = () => {}
        if(withSpinner){
            unblock = setScreenSpinner()
        }
		let posts_req = await api('/get_posts_by_bookids', {books:books, page:0})

		if(posts_req.posts){
			setCurrentPostsPage(0)
			setCurrentPosts(posts_req.posts)
		}
        if(withSpinner){
            unblock()
        }
	}

    function setSnackbar(snack=null, name=null){
        setSnackbar_state({snack:snack, name:name})
    }


    let storage = {
        initFetch, setInitFetch,

        init, setInit,
        vkUser, setVkUser,

        activeBooks, setActiveBooks,
        choisedBooks, setChoisedBooks,
        currentPosts, setCurrentPosts,
        currentPostsPage, setCurrentPostsPage,

        snackbar, setSnackbar,
        popout, setPopout,

        currentEditBook, setCurrentEditBook,

        creatingPost, setCreatingPost,

        publicBookPosts, setPublicBookPosts,

        ReloadJournal, setScreenSpinner,

        isDesktop
    }

    return <current_storage.Provider value = {storage}>
        {children}
    </current_storage.Provider>
}