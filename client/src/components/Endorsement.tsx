export const Endorsement = ({endorsement}) => {
    return (
        <div className="endorsement">
            <p><b>"{endorsement.endorsement}"</b></p>
            <p>-{endorsement.endorser} on {endorsement.endorseProject}</p>
        </div>
    )
}