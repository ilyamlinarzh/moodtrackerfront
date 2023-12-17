import { back, push, replace, useMeta, useParams } from "@itznevikat/router"
import { Card, CardGrid, Div, Group, Panel, PanelHeader, PanelHeaderBack, PanelHeaderButton, Separator, Spacing, Spinner, Title } from "@vkontakte/vkui"
import { useEffect, useState } from "react"
import { useStorage } from "../../hooks/useStorage"
import { api } from "../../server"
import { Snack } from "../../components/Snack/Snack"
import { current_year, months, textInputLength } from "../../consts"
import { ClearInput } from "../../components/ClearInput/ClearInput"
import { Icon24Spinner, Icon28DeleteOutline, Icon28EditOutline, Icon28ViewOutline } from "@vkontakte/icons"
import { BaseImagesCollection } from "../../components/AttachmentInput/AttachmentInput"
import { AttachmentCountTip, AuthorTip, BookTip } from "../../components/PostBlock/PostBlock"

import './Post.css'
import { text_maxlength } from "../../limits"

export const Post = ({nav}) => {

    let {
        setSnackbar,
        currentPosts, setCurrentPosts, 
        init, vkUser
    } = useStorage()

    let { id: post_id } = useParams()

    const [fetching, setFetching] = useState(false)
    const [post, setPost] = useState(null)
    const [text, setText] = useState('')
    const [fetchingSave, setFetchingSave] = useState(false)
    const [attachments, setAttachments] = useState([])

    const [editMode, setEditMode] = useState(false)

    useEffect(()=>{
        async function fetchData(){
            setFetching(true)
            let f_post = currentPosts.find(p=>p.post_id==post_id)
            if(f_post && f_post.attachments_count == 0 && false){
                setPost(f_post)
                setText(f_post.text)
                setEditMode(f_post.book.author_id == init.user.userid)
            }
            else{
                let post_req = await api('get_post', {post_id:post_id})
                .catch(err=>{
                    back()
                    setSnackbar(<Snack mode="error">Произошла ошибка при загрузке записки</Snack>, 'inpost')
                    return;
                })

                if(post_req.post){
                    setPost(post_req.post)
                    setAttachments(post_req.post.attachments)
                    setText(post_req.post.text)
                    setEditMode(post_req.post.book.author_id == init.user.userid)
                }else{
                    back()
                    setSnackbar(<Snack mode="error">{post_req.message}</Snack>, 'outpost')
                }
            }

            setFetching(false)
        }

        fetchData()
    }, [])

    const CaptionTips = ({value, title=null}) => {
        return(
        <div className = 'tipsContainer'>
            {title}
            <BookTip name={value.book.name} />
            <AuthorTip user={value.author} />
            {value.attachments_count > 0 && <AttachmentCountTip n={value.attachments_count} />}
        </div>
        )
    }

    async function save(){
        setFetchingSave(true)
        let save_req = await api('edit_text_post', {post_id:post_id, text:text})
        .catch((err)=>{console.log(err)})
        if(save_req.edit){
            let localCurrentPosts = currentPosts
            localCurrentPosts.find(p=>p.post_id==post_id).text=text
            setCurrentPosts(localCurrentPosts)
        }
        setFetchingSave(false)
    }

    useEffect(() => {
        if(!post || post.text == text){
            return;
        }

        const saveTimer = setTimeout(() => {
          save()
        }, 1000); // 1000 миллисекунд (1 секунда)
    
        // Очищаем таймер при каждом изменении ввода
        return () => clearTimeout(saveTimer);
      }, [text]);


    const changeText = (text_e) => {
        setText(text_e)
    }

    const RemoveButton = () => {
        if(!post){return null}

        if((post.author.userid == init.user.userid) || (post.book.author_id == init.user.userid)){
            return <PanelHeaderButton>
                <Icon28DeleteOutline onClick = {()=>{
                    push(`/post?id=${post_id}&popout=rm-post`)
                }}/>
            </PanelHeaderButton>
        }

        return null
    }

    return(
        <Panel
        nav={nav}
        >
            <PanelHeader
            before={<>
            <PanelHeaderBack onClick={back} />
            <RemoveButton />
            </>}
            separator={false}
            />
            <Group>
                {fetching && <Spinner size='regular' />}
                {post && !fetching &&
                <Div>
                    <div className='post_title'><Title weight="1" level="1">{`${post.date.day} ${months[post.date.month-1]}${current_year!=post.date.year ? ` ${post.date.year}` : ""}`}</Title>{fetchingSave && <div><Spinner size = 'small'/></div>}</div>
                    <CaptionTips value={post}/>
                    <ClearInput setText={changeText} placeholder="Тут совсем пусто..." changable={editMode} heightLock={false} defaultValue={post.text} />
                    {attachments.length > 0 && <BaseImagesCollection style = {{paddingTop:'10px'}} collection={attachments} />}

                    {post.extra_content.extraQ &&
                    <div style={{opacity:.9}}>
                    <Spacing size={20}>
                        <Separator />
                    </Spacing>
                    <Title weight="1" level="1">{post.extra_content.extraQ.question}</Title>
                    <ClearInput changable={false} defaultValue={post.extra_content.extraQ.answer} />
                    </div>
                    }
                </Div>
                }
            </Group>
        </Panel>
    )
}