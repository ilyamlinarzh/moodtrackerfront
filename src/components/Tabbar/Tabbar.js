import { TabbarItem } from "@vkontakte/vkui"
import { Tabbar as TabbarVK } from "@vkontakte/vkui"
import { useLocStorage } from "../../hooks/useLocStorage"
import { Icon28AddCircleFillBlue, Icon28PosterIcon, Icon28Settings, Icon28SettingsOutline, Icon28WalletOutline } from "@vkontakte/icons"

export const Tabbar = () => {
    let {
        activeView, onStoryChange
    } = useLocStorage()

    return(
        <TabbarVK mode="auto">
            <TabbarItem
            onClick={onStoryChange}
            selected={activeView==='home'}
            data-story='home'
            >
                <Icon28WalletOutline />
            </TabbarItem>
            <TabbarItem
            onClick={onStoryChange}
            selected={activeView==='home'}
            data-story='home'
            >
                <Icon28WalletOutline />
            </TabbarItem>
            <TabbarItem>
                <Icon28AddCircleFillBlue width={32} height={32}/>
            </TabbarItem>
            <TabbarItem
            onClick={onStoryChange}
            selected={activeView==='home'}
            data-story='home'
            >
                <Icon28WalletOutline />
            </TabbarItem>
            <TabbarItem
            onClick={onStoryChange}
            selected={activeView==='settings'}
            data-story='settings'
            text='Настройки'
            >
                <Icon28SettingsOutline />
            </TabbarItem>
        </TabbarVK>
    )
}