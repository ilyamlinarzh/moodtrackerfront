import { useEffect } from "react"


export const SVGReader = ({className, svg}) => {

    useEffect(()=>{
        document.getElementsByClassName(className)[0].innerHTML = svg
    }, [])

    return <div className={className} />
}