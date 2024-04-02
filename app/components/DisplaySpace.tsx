'use client'
import Image from 'next/image'
import React, { useContext } from 'react'
import { clientContext } from '../contexts/ClientMoveContext'
import Piece from '../models/Piece'

//define an interface to render data to the space
interface Props {
    pieces: Piece[],
    id: number
}

const DisplaySpace: React.FC<Props> = ({ pieces, id }: Props) => {
    const desertColor = "bg-amber-950"
    const koyaColor = "bg-amber-700"
    const p1Color = "bg-amber-500"
    const p2Color = 'bg-green-700'
    //floating styles
    let selectedStyle = "bg-amber-900 "
    let hoverStyle = " hover:bg-amber-200"
    //Clever display logic for UI
    let display = ''

    //extracts context
    const { ClientMove, setClientMove } = useContext(clientContext)
    //handle Click
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault()
        //only updates relevant 'location' data fields
        setClientMove({ MoveType: ClientMove.MoveType, Player: ClientMove.Player, TargetSpaceID: id })
    }

    //if the data has pieces, check display of the "top piece"
    if (pieces.length > 0) {
        //assigns display the value of the "bottom piece"
        display = pieces[0].data
        //check if stacked
        if (pieces.length > 1) {
            //render TRUNK!
            display = "T" + (pieces.length - 1).toString()
            if (pieces[0].isP1) {
                //p1 trunk
                selectedStyle = p1Color
                hoverStyle = "" //no hover
            }
            else {
                //p2 trunk
                selectedStyle = p2Color
                hoverStyle = "" //no hover
            }
        }
        else if (display == "XX") {
            //render desert
            selectedStyle = desertColor
            hoverStyle = "" //no hover
        }
        else if (display == "KK") {
            //render koya
            selectedStyle = koyaColor
            hoverStyle = "" //no hover
        }
        else if (display == "1R") {
            //render p1 root
            selectedStyle = p1Color
            hoverStyle = "" //no hover
        }
        else if (display == "2R") {
            //render p2 root
            selectedStyle = p2Color
            hoverStyle = "" //no hover
        }
        else {
            //render seed
            if (pieces[0].isP1) {
                //render P1Seed
                selectedStyle = p1Color
                hoverStyle = "" //no hover
            }
            else {
                //render P2Seed
                selectedStyle = p2Color
                hoverStyle = "" //no hover
            }
        }
    }
    //no data -- empty space
    else {
        if (ClientMove.TargetSpaceID === id) {
            //we are the selected space!
            if (ClientMove.MoveType == 'D') {
                //desert color
                selectedStyle = "bg-orange-950 "
            }
            else {
                //custom colors for the players
                if (ClientMove.Player === 1) {
                    //player 1 seed color
                    selectedStyle = 'bg-amber-500 '
                }
                //player 2 seed color
                else selectedStyle = 'bg-green-700 '
            }
        }
        if (ClientMove.Player === 0 && ClientMove.MoveType != 'D') {
            //player 2 color
            hoverStyle = 'hover:bg-green-700'
        }
        else if (ClientMove.Player === 1 && ClientMove.MoveType != 'D') {
            //player 1 color
            hoverStyle = 'hover:bg-amber-500'
        }
        //desert color
        else hoverStyle = "hover:bg-amber-950"
    }
    return (
        <div onClick={handleClick} className={'m-1 text-center max-h-14 max-w-14 min-h-14 min-w-14 ' + selectedStyle + hoverStyle} >
            <br />
            {display}
            <br />
        </div >
    )


}

export default DisplaySpace