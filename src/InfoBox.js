import React from 'react';
import { Card, CardContent, Typography } from '@material-ui/core';
import "./InfoBox.css";

function InfoBox({ title, cases, active, casesRed, deathRed, green, total, ...props }) {
    return (
        <Card onClick={props.onClick} className={`infobox ${active && "infobox--selected" } ${deathRed && "infobox--death"} ${casesRed && "infobox--cases"}`}>
            <CardContent>
                <Typography className="infobox-title" color="textSecondary">{title}</Typography>

                <h2 className={`infobox-cases ${!casesRed & !deathRed && "infobox-cases-green"} ${!casesRed & !green && "infobox-cases-death"}`}>{cases}</h2>

                <Typography className="infobox-total " color="textSecondary" >{total} Total</Typography>
            </CardContent>
        </Card>
    )
}

export default InfoBox 
