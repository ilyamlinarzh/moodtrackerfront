import { Avatar, Button, CardGrid, Footer, Gradient, Group, InfoRow, Panel, PanelHeader, PanelHeaderBack, Placeholder, SimpleCell, Text, Title } from "@vkontakte/vkui"
import { useEffect, useState } from "react"
import { useStorage } from "../../hooks/useStorage"
import { api } from "../../server"
import { back, push, replace, useMeta } from "@itznevikat/router"
import { declOfNumText, page_posts_size } from "../../consts"
import { AuthorTip, PostBlock } from "../../components/PostBlock/PostBlock"

import './Book.css'
import { Icon56CancelCircleOutline } from "@vkontakte/icons"


const styles = {
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: 20,
  };

export const DiaryPublic = ({nav}) => {
    
    const [fetching, setFetching] = useState(false)

    let {
        init, 
        snackbar, setSnackbar, 
        activeBooks, setActiveBooks,
        publicBookPosts: posts, setPublicBookPosts: setPosts,
        setScreenSpinner
    } = useStorage()

    let { book } = useMeta()

    let admin = book && book.author.userid == init.user.userid
    let member = book && activeBooks.find(b=>b.book_id==book.book_id)

    useEffect(()=>{
        async function fetchDiary(){
            if(admin||member){
                replace('/book', {book_id:book.book_id})
                return;
            }

            setFetching(true)

            if(posts == null){
                let posts_req = await api('get_books_posts', {book_id:book.book_id, page:0}).catch((err)=>console.log(err))

                if(posts_req.posts){
                    setPosts({page:0, posts:posts_req.posts})
                }else{
                    back()
                }
            }

            setFetching(false)
        }

        fetchDiary()
    }, [])

    const ReloadNextPage = async () => {
		const unblock = setScreenSpinner()
		api('get_books_posts', {book_id:book.book_id, page:posts.page+1})
		.then(res=>{
            if(res.posts){
                setPosts({page:posts.page+1, posts:[...posts.posts, ...res.posts]})
            }
		})
        unblock()
	}

    let nextButton = posts && (page_posts_size*(posts.page+1)) == posts.posts.length

    return (
    <Panel
    nav={nav}
    >
        <PanelHeader before={<PanelHeaderBack onClick={()=>back()} />}>Дневник</PanelHeader>
        <Group>
            {book && 
            <>
            <Gradient mode='tint' to='top' style={styles}>
                <Title style={{ marginBottom: 8, marginTop: 20 }} level="2" weight="2">
                    {book.name}
                </Title>
                <Text
                    style={{
                    marginBottom: 24,
                    color: 'var(--vkui--color_text_secondary)',
                    }}
                >
                    {book.description}
                </Text>
            </Gradient>
            {/* <Avatar src = {book.author.photo} />  */}
            </>
            }
            <Group mode="plain">
                <CardGrid size='l'>
                {posts && posts.posts.map((post)=>{
                    return(
                        <PostBlock onClick={()=>push(`/post?id=${post.post_id}`)} key={post.post_id} value={post}/>
                    )
                })}
                </CardGrid>
                {posts && posts.posts && posts.posts.length == 0 &&
                <Placeholder
                icon={<Icon56CancelCircleOutline/>}
                header='Записей нет'
                >
                    Автор дневника ещё не оставлял записи в этом дневнике
                </Placeholder>
                }
                {(posts && posts.posts.length > 0 && nextButton) &&
                <div className = 'moreButton_container'>
                    <Button
                    mode='secondary'
                    onClick={ReloadNextPage}
                    >Загрузить ещё</Button>
                </div>
                }
                {(posts && posts.posts.length > 0 && !nextButton) && <Footer>{declOfNumText(posts.posts.length, ['запись','записи','записей'])}</Footer>}
            </Group>
        </Group>
        {['inbook'].includes(snackbar.name) && snackbar.snack}
    </Panel>
    )
}