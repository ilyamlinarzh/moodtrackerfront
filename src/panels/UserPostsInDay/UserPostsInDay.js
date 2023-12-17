import { back, push, useMeta } from "@itznevikat/router"
import { CardGrid, CellButton, Footer, Group, Panel, PanelHeader, PanelHeaderBack, Placeholder, Separator, Spacing, Spinner } from "@vkontakte/vkui"
import { useScroll } from "@vkontakte/vkui/dist/components/AppRoot/ScrollContext"
import { useEffect, useState } from "react"
import { api } from "../../server"
import { useStorage } from "../../hooks/useStorage"
import { PostBlock } from "../../components/PostBlock/PostBlock"
import { declOfNumText, months } from "../../consts"
import { Icon28SmileOutline, Icon56CancelCircleOutline } from "@vkontakte/icons"


export const UserPostsInDay = ({nav}) => {

    const [posts, setPosts] = useState(null)

    let {
        d,m,y,
        mood
    } = useMeta()

    let {
        activeBooks
    } = useStorage()

    useEffect(()=>{
        console.log(d,m,y)
        async function fetchPosts(){
            let posts_req = await api('get_posts_by_bookids_in_day', {day:d, month:m, year:y, books:activeBooks.map(b=>b.book_id)})
            .catch((err)=>{
                console.log(err)
            })

            if(posts_req.posts){
                setPosts(posts_req.posts)
            }
        }

        if(activeBooks.length > 0){
            fetchPosts()
        }else{
            setPosts([])
        }
    }, [])


    return(
        <Panel
        nav={nav}
        >
            <PanelHeader before = {
                <PanelHeaderBack onClick={back} />
            }>
                {`${d} ${months[m-1]}`}
            </PanelHeader>
            <Group>
                {posts == null ? 
                <Spinner size='regular' />
                :
                <>
                    <>
                    <CellButton
                    before={<Icon28SmileOutline />}
                    onClick={()=>push('/setmood', {d:d, m:m, y:y})}
                    >
                        {!mood ? 'Установить настроение' : 'Поменять настроение'}
                    </CellButton>
                    <Spacing size={8}>
                        <Separator />
                    </Spacing>
                    </>
                    <CardGrid size='l'>
                        {posts.map(post=>{
                            return(
                                <PostBlock value={post} key={post.post_id} onClick={()=>push(`/post?id=${post.post_id}`)} />
                            )
                        })}
                    </CardGrid>
                </>
                }
                {posts!=null && posts.length>0 && 
                    <Footer>{declOfNumText(posts.length, ['запись', 'записи', 'записей'])}</Footer>
                }
                {posts!=null && posts.length == 0 &&
                <Placeholder
                icon={<Icon56CancelCircleOutline />}
                header='Записей не найдено'
                >
                    Не найдено ни одной записи на эту дату в ваших дневниках
                </Placeholder>
                }
            </Group>
        </Panel>
    )
}