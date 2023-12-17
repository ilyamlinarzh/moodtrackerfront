import { useContext } from "react"
import { current_storage } from "../hoc/StorageProvider"


export const useStorage = () => {
    return useContext(current_storage)
}