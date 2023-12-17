import { back, replace, useActionRef, useMeta } from "@itznevikat/router"
import { ActionSheet, ActionSheetDefaultIosCloseItem, ActionSheetItem } from "@vkontakte/vkui"
import { months } from "../../consts";
import { useEffect } from "react";
import { useStorage } from "../../hooks/useStorage";
import { Icon28ChainOutline, Icon28GridSquareOutline, Icon28ShareOutline, Icon28SmileOutline } from "@vkontakte/icons";
import bridge from "@vkontakte/vk-bridge";
import { Snack } from "../Snack/Snack";


export const TimePostAction = () => {

    let {
        creatingPost, setCreatingPost
    } = useStorage()

    let today = new Date();
    let yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    let {actionRef} = useActionRef()

    useEffect(()=>{
        if(!creatingPost){
            back()
        }
    }, [])

    const writeDate = (d, m, y) => {
        setCreatingPost({...creatingPost, date:{day:d, month:m, year:y}})
        back()
    }

    
    return(
        <ActionSheet 
        onClose = {back} 
        toggleRef={actionRef}
        iosCloseItem={<ActionSheetDefaultIosCloseItem />}
        >
            <ActionSheetItem 
            onClick={()=>writeDate(today.getDate(), today.getMonth()+1, today.getFullYear())}
            >
                {`${today.getDate()} ${months[today.getMonth()]}`}
            </ActionSheetItem>

            {(today.getHours() < 9 && today.getMinutes() < 55) && 
            <ActionSheetItem 
            onClick={()=>writeDate(yesterday.getDate(), yesterday.getMonth()+1, yesterday.getFullYear())}
            >
                {`${yesterday.getDate()} ${months[yesterday.getMonth()]}`}
            </ActionSheetItem>}
        </ActionSheet>
    )
}

export const ShareProfileAction = () => {
    let {actionRef} = useActionRef()

    let {
        init, setSnackbar
    } = useStorage()

    function copyLink(){
        bridge.send('VKWebAppCopyText', {text:`https://vk.com/app51761387#/?profile=${init.user.userid}`})
        .then((data)=>{
            setSnackbar(<Snack mode='ok'>Ссылка была скопирована в буфер обмена</Snack>, 'profile')
        })
        .catch((err)=>{
            setSnackbar(<Snack mode='error'>Не удалось скопировать ссылку</Snack>, 'profile')
        })
    }

    function share(){
        bridge.send('VKWebAppShare', {link:`https://vk.com/app51761387#/?profile=${init.user.userid}`})
        .then((data)=>{
            if(data.result){
                back()
            }
        })
    }

    return(
        <ActionSheet 
        onClose = {back} 
        toggleRef={actionRef}
        iosCloseItem={<ActionSheetDefaultIosCloseItem />}
        >
            <ActionSheetItem
            before={<Icon28ShareOutline />}
            onClick={share}
            >
                Поделиться
            </ActionSheetItem>
            <ActionSheetItem
            before={<Icon28ChainOutline />}
            onClick={copyLink}
            autoClose
            >
                Скопировать ссылку
            </ActionSheetItem>
        </ActionSheet>
    )
}

export const CalendarDayActions = () => {
    let {actionRef} = useActionRef()

    console.log(actionRef)

    let {
        init
    } = useStorage()

    let {
        d,m,y
    } = useMeta()

    return(
        <ActionSheet 
        onClose = {back} 
        toggleRef={actionRef}
        popupDirection='top'
        // popupOffsetDistance={500}
        iosCloseItem={<ActionSheetDefaultIosCloseItem />}
        >
            <ActionSheetItem
            before={<Icon28SmileOutline />}
            onClick={()=>replace('/setmood', {d:d, m:m, y:y})}
            >
                Установить настроение
            </ActionSheetItem>
            <ActionSheetItem
            before={<Icon28GridSquareOutline />}
            onClick={()=>replace('/inday', {d:d, m:m, y:y})}
            >
                Посмотреть записи
            </ActionSheetItem>
        </ActionSheet>
    )
}