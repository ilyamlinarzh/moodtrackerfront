import { Div, FixedLayout, Group } from "@vkontakte/vkui"
import { useStorage } from "../../hooks/useStorage"


export const FixedLayoutCustom = ({children, filled}) => {

    let {
        isDesktop
    } = useStorage()

    if(isDesktop){
        return children
    }

    return <FixedLayout vertical='bottom' filled={filled}>
        {children}
    </FixedLayout>
}