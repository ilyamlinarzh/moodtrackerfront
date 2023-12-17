import { Icon28AddOutline, Icon28SettingsOutline } from "@vkontakte/icons"
import { Cell, List, PanelHeaderContext, ScreenSpinner } from "@vkontakte/vkui"
import { RemoveBookAlert, RemovePostAlert } from "./Alerts"
import { CalendarDayActions, ShareProfileAction, TimePostAction } from "./Actions"




export const popouts_list = [
    <ScreenSpinner size='large' id='fetching' nav='fetching' />,
    <RemoveBookAlert nav='rm-book' />,
    <RemovePostAlert nav='rm-post' />,
    <TimePostAction nav='post-date' />,
    <ShareProfileAction nav='share-profile' />,
    <CalendarDayActions nav='calendaraction' />
]