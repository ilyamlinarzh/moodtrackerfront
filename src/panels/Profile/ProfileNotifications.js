import { FormItem, FormLayout, FormStatus, Group, Panel, PanelHeader, PanelHeaderBack, ScreenSpinner, SimpleCell, Switch } from "@vkontakte/vkui"
import { useStorage } from "../../hooks/useStorage"
import { api } from "../../server"
import { useState } from "react"
import { back } from "@itznevikat/router"
import bridge from "@vkontakte/vk-bridge"


export const ProfileNotifications = ({nav}) => {

    let {
        setInit, init, 
        setPopout
    } = useStorage()

    const [app, setApp] = useState(init.settings.notifications.app)
    const [messages, setMessages] = useState(init.settings.notifications.messages)

    async function changeExtraQ(e){
        setPopout(<ScreenSpinner size='large' />)
        let value = e.currentTarget.checked
        let extra_req = await api('/set_extraQ', {extraQ:value, unusualExtraQ:unusualExtraQ}).catch(err=>console.log(err))
        if(extra_req && extra_req.code == 200){
            setExtraQ(value)
            setInit({...init, settings:{...init.settings, extraQ:{extraQ:value, unusualExtraQ:unusualExtraQ}}})
        }
        setPopout(null)
    }

    async function changeMessages(e){
        setPopout(<ScreenSpinner size='large' />)
        let value = e.currentTarget.checked
        if(value){
            await bridge.send("VKWebAppAllowMessagesFromGroup", {group_id:223332006}).then(async (data)=>{
                if(data.result){
                    let extra_req = await api('/set_notifications', {app_notify:app, messages_notify:value}).catch(err=>console.log(err))
                    if(extra_req && extra_req.code == 200){
                        setMessages(value)
                        setInit({...init, settings:{...init.settings, notifications:{app:app, messages:value}}})
                    }
                }
            }).catch((err)=>console.log(err))
        }else{
            let extra_req = await api('/set_notifications', {app_notify:app, messages_notify:value}).catch(err=>console.log(err))
            if(extra_req && extra_req.code == 200){
                setMessages(value)
                setInit({...init, settings:{...init.settings, notifications:{app:app, messages:value}}})
            }
        }
        setPopout(null)
    }

    async function changeApp(e){
        setPopout(<ScreenSpinner size='large' />)
        let value = e.currentTarget.checked
        if(value){
            await bridge.send("VKWebAppAllowNotifications").then(async (data)=>{
                if(data.result){
                    let extra_req = await api('/set_notifications', {app_notify:value, messages_notify:messages}).catch(err=>console.log(err))
                    if(extra_req && extra_req.code == 200){
                        setApp(value)
                        setInit({...init, settings:{...init.settings, notifications:{app:value, messages:messages}}})
                    }
                }
            }).catch((err)=>console.log(err))
        }else{
            let extra_req = await api('/set_notifications', {app_notify:value, messages_notify:messages}).catch(err=>console.log(err))
            if(extra_req && extra_req.code == 200){
                setApp(value)
                setInit({...init, settings:{...init.settings, notifications:{app:value, messages:messages}}})
            }
        }
        setPopout(null)
    }

    return(
        <Panel
        nav={nav}
        >
            <PanelHeader
            before={<PanelHeaderBack onClick={back} />}
            >Уведомления</PanelHeader>
            <Group>
                <FormStatus mode='default' header='Уведомления'>
                    Разрешите нам присылать уведомления - мы будем оповещать вас о важных изменениях и напоминать о ведении дневников
                </FormStatus>
                {init && init.settings &&
                <FormLayout>
                    <FormItem bottom='Сможем присылать уведомления в приложение ВКонтакте'>
                        <SimpleCell
                        multiline
                        Component='label'
                        after={<Switch onChange={changeApp} checked={app} />}
                        >Уведомления от приложения</SimpleCell>
                    </FormItem>
                    <FormItem bottom='Сможем писать вам в личные сообщения'>
                        <SimpleCell
                        multiline
                        Component='label'
                        after={<Switch onChange={changeMessages} checked={messages} />}
                        >Уведомления от сообщества</SimpleCell>
                    </FormItem>
                </FormLayout>
                }
            </Group>
        </Panel>
    )
}