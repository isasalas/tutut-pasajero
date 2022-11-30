import io from 'socket.io-client'
import { urlSocket } from '../utils/ApiData'

let socket = io(urlSocket)

export default socket