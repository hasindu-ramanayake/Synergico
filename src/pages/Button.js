import React, { useState, useEffect } from 'react'


function ButtonChange(Oid) {

    const [state, setState] = useState("");
    const [buttonState, setButtonState] = useState("new");

    const ButtonConditionals = (Oid) => (
        buttonState === "new" ?
            < Button.Group >
                <Button onClick={(e) => OnclickButtonReject(e, Oid)}>Reject</Button>
                <Button.Or />
                <Button positive onClick={(e) => OnclickButtonAccept(e, Oid)}>Accept</Button>
            </Button.Group >
            :
            <Label>{state}</Label>
    )


}


