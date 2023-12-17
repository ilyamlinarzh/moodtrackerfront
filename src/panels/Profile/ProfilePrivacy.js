import { FormItem, FormLayout, FormStatus, Group, Panel, PanelHeader, PanelHeaderBack, ScreenSpinner, SimpleCell, Switch } from "@vkontakte/vkui"
import { useStorage } from "../../hooks/useStorage"
import { api } from "../../server"
import { useState } from "react"
import { back } from "@itznevikat/router"
import bridge from "@vkontakte/vk-bridge"


export const ProfilePrivacy = ({nav}) => {

    let {
        setInit, init, 
        setPopout
    } = useStorage()

    const [moodPublic, setMoodPublic] = useState(init.settings.privacy.mood_public)
    const [profileButton, setProfileButton] = useState(init.settings.privacy.profile_button)

    async function changeMoodMode(e){
        setPopout(<ScreenSpinner size='large' />)
        let value = e.currentTarget.checked
        let extra_req = await api('/set_privacy', {mood_public:value, profile_button:profileButton}).catch(err=>console.log(err))
        if(extra_req && extra_req.code == 200){
            setMoodPublic(value)
            setInit({...init, settings:{...init.settings, privacy:{mood_public:value, profile_button:profileButton}}})
        }
        setPopout(null)
    }

    async function changeProfileButton(e){
        let value = e.currentTarget.checked
        console.log(value)
        if(value){
            console.log(123)
            let bp = await bridge.send('VKWebAppAddToProfile', )
            .catch((err)=>console.log(err))
        }
    }

    return(
        <Panel
        nav={nav}
        >
            <PanelHeader
            before={<PanelHeaderBack onClick={()=>back()} />}
            >Приватность</PanelHeader>
            <Group>
                <FormStatus mode='default' header='Приватность'>
                    Вы можете показать свой календарь настроения другим пользователям 
                </FormStatus>
                {init && init.settings &&
                <FormLayout>
                    <FormItem bottom='Если ваш календарь публичный, то его можно посмотреть, перейдя по ссылке'>
                        <SimpleCell
                        multiline
                        Component='label'
                        after={<Switch onChange={changeMoodMode} checked={moodPublic} />}
                        >Публичный календарь</SimpleCell>
                    </FormItem>
                    {/* <FormItem bottom='В ваш календарь можно будет зайти через кнопку в профиле ВКонтакте'>
                        <SimpleCell
                        multiline
                        Component='label'
                        after={<Switch onChange={changeProfileButton} checked={profileButton} />}
                        >Кнопка в профиле</SimpleCell>
                    </FormItem> */}
                </FormLayout>
                }
            </Group>
        </Panel>
    )
}