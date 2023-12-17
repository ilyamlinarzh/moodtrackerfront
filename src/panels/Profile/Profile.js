import { Group, Panel, PanelHeader, PanelHeaderBack, Gradient, Avatar, Title, SimpleCell, List, Link, Footer, Header, Spacing, Separator, Div, Button } from "@vkontakte/vkui"
import { useStorage } from "../../hooks/useStorage";
import { Icon28Hearts2Outline, Icon28Notifications, Icon28PrivacyOutline, Icon28QuestionOutline, Icon28Users3Outline, Icon28UsersCircleFillBlue } from "@vkontakte/icons";
import { back, push, useActionRef } from "@itznevikat/router";
import { mood_colors } from "../../consts";
import { MoodCalendarMonth } from "../../components/MoodCalendar/MoodCalendarMonth";

const styles = {
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: 32,
  };

export const Profile = ({nav}) => {
    let {
        init, vkUser, snackbar
    } = useStorage()

    const {setActionRefHandler:openShare} = useActionRef(()=>push('/profile?popout=share-profile'))

    console.log(init)

    return (
        <Panel
        nav={nav}
        >
            <PanelHeader
            before={<PanelHeaderBack onClick={back} />}
            >
                Профиль
            </PanelHeader>
            {vkUser &&
                <Group>
                    <Gradient mode="tint" to='top' style={styles}>
                        <Avatar size={96} src={vkUser.photo_200}/>
                        <Title style={{ marginBottom: 8, marginTop: 20 }} level="2" weight="2">
                        {vkUser.first_name + ' ' + vkUser.last_name}
                        </Title>
                        <Spacing size={12} />
                        <Button 
                        mode='secondary'
                        onClick={openShare}
                        size="s">Поделиться профилем</Button>
                    </Gradient>
                    <Spacing size={10} />
                    <Group separator='hide' header={<Header mode='secondary'>Трекер настроения</Header>}>
                        <MoodCalendarMonth user={vkUser.id} />
                    </Group>
                    <Group header={<Header mode='secondary'>Параметры</Header>}>
                        <List>
                            <SimpleCell 
                            before={<Icon28QuestionOutline />}
                            onClick={()=>push('/profile_questions')}
                            >
                                Дополнительные вопросы</SimpleCell>
                            <SimpleCell 
                            onClick={()=>push('/profile_notifications')}
                            before={<Icon28Notifications />}>Уведомления</SimpleCell>
                            <SimpleCell 
                            onClick={()=>push('/profile_privacy')}
                            before={<Icon28PrivacyOutline />}>Приватность</SimpleCell>
                            {/* <SimpleCell before={<Icon28Users3Outline />}>Друзья</SimpleCell> */}
                        </List>
                        <Spacing size={20}>
                            <Separator />
                        </Spacing>
                        <List>
                            <SimpleCell href="https://vk.com/moodjournal_pub" target="_blank" before={<Icon28UsersCircleFillBlue />}>Сообщество приложения</SimpleCell>
                            <SimpleCell href="https://vk.com/studio_326" target="_blank" before={<Icon28Hearts2Outline />}>Сообщество разработчиков</SimpleCell>
                        </List>
                    </Group>

                    <Footer>Разработано в 326studio [1.5r]</Footer>
                </Group>
            }
            {['profile'].includes(snackbar.name) && snackbar.snack}
        </Panel>
    )
}