import { Button, Avatar, CustomSelectOption, Div, FixedLayout, FormItem, FormLayout, Group, Panel, PanelHeader, PanelHeaderBack, Select, SelectMimicry, Textarea, Title, Spacing, CardGrid, Card, Header, NativeSelect, SimpleCell, ScreenSpinner } from "@vkontakte/vkui"
import { ClearInput } from "../../components/ClearInput/ClearInput"
import { useEffect, useState } from "react"
import { useStorage } from "../../hooks/useStorage"
import { back, block, go, push, replace, useActionRef } from "@itznevikat/router"
import { months, mood_colors, textInputLength } from "../../consts"
import { EGetLaunchParamsResponsePlatforms } from "@vkontakte/vk-bridge"
import { MoodInput } from "../../components/MoodInput/MoodInput"
import { AttachmentInput } from "../../components/AttachmentInput/AttachmentInput"
import { api } from "../../server"
import { Snack } from "../../components/Snack/Snack"
import { text_maxlength } from "../../limits"
import { FixedLayoutCustom } from "../../components/FixedLayoutCustom/FixedLayoutCustom"


export const NewPostQuestion = ({nav, question, placeholder='Напишите, что у вас произошло'}) => {

    let {
        init,
        creatingPost, setCreatingPost, isDesktop
    } = useStorage()

    const [text, setText] = useState(creatingPost && creatingPost.text ? creatingPost.text : '')

    useEffect(()=>{
        if(creatingPost == null){
            setCreatingPost({})
        }
    }, [])

    const next = () => {
        setCreatingPost({...creatingPost, text:text.length == 0 ? '' : text})
        console.log(init)
        if(init.extraQ.extraQ && init.extraQ.question){
            push('/extra_question')
        }else{
            if(init.mood.mood > 0){
                push('/post_publication')
            }else{
                push('/mood_question')
            }
        }
    }

    let canEscape = ((init.extraQ.extraQ && init.extraQ.question) || (init.mood.mood < 0)) && false

    return(
        <Panel
        nav={nav}
        >
            <PanelHeader separator={false} before={
                <PanelHeaderBack onClick={()=>back()} />
            }>
            </PanelHeader>

            <Group>
                <Div style = {{paddingBottom:'68px'}}>
                <Title level="1" weight='1'>{question}</Title>
                <FormItem style={{padding:0}}>
                    <ClearInput setText={setText} placeholder={placeholder} defaultValue={text} />
                </FormItem>
                </Div>
                <FixedLayoutCustom vertical='bottom' filled>
                    <FormItem>
                    <Button 
                        disabled={textInputLength(text) > text_maxlength || (text.length == 0 && !canEscape)}
                        onClick={next}
                        size='l' 
                        stretched>{(text.length == 0 && canEscape) ? 'Пропустить' : 'Далее'}</Button>
                    </FormItem>
                </FixedLayoutCustom>
            </Group>
        </Panel>
    )
}

export const ExtraQuestion = ({nav}) => {

    let {
        init, 
        creatingPost, setCreatingPost
    } = useStorage()

    const [text, setText] = useState(creatingPost && creatingPost.extra && creatingPost.extra.length > 0 ? creatingPost.extra : '')

    const next = () => {
        setCreatingPost({...creatingPost, extra:text.length == 0 ? '' : text})
        
        if(init.mood.mood < 0){
            push('/mood_question')
        }else{
            push('/post_publication')
        }
    }

    let canEscape = (creatingPost && creatingPost.text && creatingPost.text.length > 0) || (init.mood.mood < 0)


    return(
        <Panel
        nav={nav}
        >
            <PanelHeader separator={false} before={
                <PanelHeaderBack onClick={()=>back()}/>
            }>
            </PanelHeader>

            {init && init.extraQ.extraQ && init.extraQ.question && 
            <Group>
                <Div>
                <Title level="1" weight='1'>{init.extraQ.question.question}</Title>
                <FormItem style={{padding:0}}>
                    <ClearInput defaultValue={text} setText={setText} placeholder='Вопрос дня' />
                </FormItem>
                </Div>
                {/* <div style={{width:'68px'}} /> */}
                <FixedLayoutCustom vertical='bottom' filled>
                    <FormItem>
                    <Button 
                        disabled={textInputLength(text) > text_maxlength || (text.length == 0 && !canEscape)}
                        onClick={next}
                        size='l' 
                        stretched>{(text.length == 0 && canEscape) ? 'Пропустить' : 'Далее'}</Button>
                    </FormItem>
                </FixedLayoutCustom>
            </Group>
            }
        </Panel>
    )
}

export const MoodQuestion = ({nav}) => {
    let {
        init, 
        creatingPost, setCreatingPost,
        setSnackbar, snackbar
    } = useStorage()

    let thisDate = new Date()

    const [selected, setSelected] = useState(creatingPost && creatingPost.mood ? creatingPost.mood : null)

    let canEscape = (creatingPost && creatingPost.text && creatingPost.text.length > 0) || (creatingPost && creatingPost.extra && creatingPost.extra.length > 0)

    const next = async () => {
        if(selected!=null){
            setCreatingPost({...creatingPost, mood:selected})
            push('/post_publication')
        }else{
            push('/post_publication')
        }
    }

    return(
        <Panel
        nav={nav}
        >
            <PanelHeader separator={false} before={
                <PanelHeaderBack onClick={()=>back()} />
            }>
            </PanelHeader>
            <Group>
                <Div>
                <Title level="1" weight='1'>Как ваше настроение сегодня?</Title>
                <Spacing size={20} />
                <MoodInput onInput={(e)=>setSelected(e)} defaultValue={selected}/>
                </Div>
                <FixedLayoutCustom vertical='bottom' filled>
                    <FormItem>
                    <Button
                        disabled={!canEscape && !selected}
                        onClick={next}
                        size='l' 
                        stretched>{(!selected && canEscape) ? 'Пропустить' : 'Далее'}</Button>
                    </FormItem>
                </FixedLayoutCustom>
            </Group>
            {['innewpost'].includes(snackbar.name) && snackbar.snack}
        </Panel>
    )
}

export const PostPublication = ({nav}) => {
    const {setActionRefHandler:openDateAction} = useActionRef(()=>push('/post_publication?popout=post-date'))
    let thisDate = new Date()

    let {
        init, setInit,
        activeBooks, setActiveBooks,
        creatingPost, setCreatingPost,
        choisedBooks, setChoisedBooks,
        currentPosts, setCurrentPosts,
        currentPostsPage, setCurrentPostsPage,
        snackbar,
        ReloadJournal,
        setSnackbar, setScreenSpinner,
        isDesktop
    } = useStorage()

    const [bookid, setBookid] = useState(choisedBooks.length > 0 ? choisedBooks[0] : activeBooks[0].book_id)
    const [attachments, setAttachments] = useState([])

    async function publicPost(){
        const unblock = setScreenSpinner()
        let post = {text:creatingPost.text, day:creatingPost.date.day, month:creatingPost.date.month, year:creatingPost.date.year, book_id:bookid}
        if(creatingPost.extra && creatingPost.extra.length > 0){
            post['extra_content'] = JSON.stringify({extraQ:{question:init.extraQ.question.question, answer:creatingPost.extra}})
        }

        if(creatingPost.mood){
            post['mood'] = creatingPost.mood
        }
        let create_post = await api('/new_post', post).catch((err)=>{
            console.log(err)
            unblock()
        })

        
        
        if(create_post.code == 200 && create_post.post && attachments.length > 0){
            const attachments_list = attachments.map((a)=>{return {type:'photobase', content:JSON.stringify({photo:a})}})
            let attach_req = await api('/add_attachments', {post_id:create_post.post.post_id, attachments:attachments_list})
            .catch(err=>{
                console.log(err)
                unblock()
            })
        }

        if(create_post && create_post.error){
            setSnackbar(<Snack mode='error'>{create_post.message ? create_post.message : 'Не удалось сохранить записку'}</Snack>, 'innewpost')
            unblock()
            return ;
        }

        let steps = 2
        if(init && init.extraQ && init.extraQ.extraQ && init.extraQ.question){
            steps += 1
        }

        if(init && init.mood && init.mood.mood == -1){
            steps += 1
        }

        if(create_post.code == 200 && create_post.post){
            let mood_o = init.mood
            if(creatingPost.mood && creatingPost.mood > 0){
                mood_o.mood = creatingPost.mood
            }

            let extra_o = init.extraQ
            if(creatingPost.extra && creatingPost.extra.length > 0){
                extra_o.extraQ = false
            }
            setInit({...init, mood:mood_o, extraQ:extra_o})
        }

        if(choisedBooks.includes(bookid)){
            create_post.post.attachments_count = attachments.length
            if(currentPosts.length%12 == 0){
                await ReloadJournal(false)
                // setCurrentPosts([create_post.post, ...currentPosts.slice(0, -1)])
            }else{
                await ReloadJournal(false)
                // setCurrentPosts([create_post.post, ...currentPosts])
            }
        }else{
            let n_b = [bookid, ...choisedBooks]
            setChoisedBooks(n_b)
            ReloadJournal(false, n_b)
        }

        unblock()
        go(-steps)
    }

    useEffect(()=>{
        setCreatingPost({...creatingPost, date:{day:thisDate.getDate(), month:thisDate.getMonth()+1, year:thisDate.getFullYear()}})
    }, [])

    useEffect(()=>{
        console.log(bookid)
    }, [bookid])

    return(
        <Panel
        nav={nav}
        >
            <PanelHeader separator={false} before={
                <PanelHeaderBack onClick={()=>back()} />
            }>
                Публикация
            </PanelHeader>
            <Group>
                <Group mode='plain' header={!isDesktop && <Header mode='secondary'>Параметры записи</Header>}>
                    <FormLayout>
                        <FormItem top = 'Дневник'>
                            <NativeSelect onChange={(e)=>setBookid(e.currentTarget.value)} defaultValue={bookid}>
                                {activeBooks.map(b=><option value={b.book_id} key={b.book_id}>{b.name}</option>)}
                            </NativeSelect>
                        </FormItem>
                    </FormLayout>
                    <SimpleCell
                    multiline
                    expandable
                    onClick={openDateAction}
                    indicator={creatingPost.date && `${creatingPost.date.day} ${months[creatingPost.date.month-1]}`}
                    >Дата публикации</SimpleCell>
                </Group>
                <Group mode='plain' header={<Header mode='secondary'>Вложения</Header>}>
                    <AttachmentInput onAttach={(img)=>setAttachments([...attachments, img])} />
                </Group>
                <FixedLayoutCustom vertical='bottom'>
                <FormItem>
                    <Button
                        onClick={publicPost}
                        size='l' 
                        stretched>Опубликовать записку</Button>
                    </FormItem>
                </FixedLayoutCustom>
            </Group>
            {['innewpost'].includes(snackbar.name) && snackbar.snack}
        </Panel>
    )
}