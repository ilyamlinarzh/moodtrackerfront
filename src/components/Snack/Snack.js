import { Snackbar, Avatar } from "@vkontakte/vkui"
import { useStorage } from "../../hooks/useStorage"
import { Icon28CheckCircleOutline, Icon28ErrorCircleOutline, Icon28InfoCircleOutline } from "@vkontakte/icons"

export const Snack = ({duration = 3000, children, mode='none'}) => {
    let {
        setSnackbar
    } = useStorage()
    let modeProps = {}
    switch(mode) {
        case 'ok':
            modeProps = {before:<Icon28CheckCircleOutline fill="var(--vkui--color_icon_positive)" />}
            break
        case 'error':
            modeProps = {before:<Icon28ErrorCircleOutline fill="var(--vkui--color_icon_negative)" />}
            break
        case 'info':
            modeProps = {before:<Icon28InfoCircleOutline />}
            break
        case 'none':
            modeProps = {}
            break
    }

    return(
        <Snackbar
        {...modeProps}
        onClose={()=>setSnackbar(null)}
        duration={duration}
        >{children}</Snackbar>
    )
}