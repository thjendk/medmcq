import React from 'react';
import Countdown from 'react-countdown';
import { Button, Divider, Grid, Icon, Image, Message } from 'semantic-ui-react';
import { useSelector } from 'react-redux';
import { ReduxState } from 'redux/reducers';
import image from './tj_profile.jpg';

interface SelectionCountdownProps {}

const SelectionCountdown = (props: SelectionCountdownProps) => {
  const user = useSelector((state: ReduxState) => state.auth.user);

  return (
    <Message style={{ border: '2px solid red' }}>
      <div style={{ textAlign: 'center', fontSize: '2em', color: 'red', fontWeight: 'bolder' }}>
        <Countdown date={new Date(2020, 10, 13)} />
      </div>
      <h2 style={{ textAlign: 'center' }}>
        {user
          ? `${user.username.toTitleCase()}, jeg har brug for din hjælp`
          : 'Jeg har brug for din hjælp'}
        . Stem til universitetsvalget inden d. 12 November!
      </h2>
      <Divider />
      <Grid stackable columns="equal">
        <Grid.Column verticalAlign="middle" width="4">
          <Grid.Row>
            <Image src={image} size="medium" />
            <p style={{ textAlign: 'center' }}>Thomas Jensen, udvikler af MedMCQ</p>
          </Grid.Row>
        </Grid.Column>
        <Grid.Column>
          <Grid.Row verticalAlign="middle">
            <p>
              De sidste 3 år har jeg repræsenteret medicin i studienævnet, og har gennem denne
              indflydelse blandt andet sikret, at MedMCQ er frit tilgængeligt for alle studerende og
              løbende får de nyeste eksamenssæt lagt ind.{' '}
              <span style={{ color: 'darkgreen' }}>
                Så længe vi har indflydelse hos ledelsen, vil jeg kæmpe for at dette ikke ændrer sig
              </span>
              . Det er blot én af de ting, som jeg og medicinerrådet har sikret de seneste år i
              studienævnet, og du kan finde langt mere information på vores{' '}
              <a href="https://www.facebook.com/MedicinerraadAU" target="__blank">
                facebook side
              </a>
              .
            </p>
            <h2 style={{ textAlign: 'center' }}>Der er normalt fredsvalg, men ikke i år.</h2>
            <p>
              Vi fører næsten aldrig valgkamp, men konservative studenter er i år opposition til
              medicinerrådet. De er et bred politisk parti, og har ikke kontakt til de studerende på
              medicin.{' '}
              <span style={{ color: 'red' }}>
                Konservative studenter går ind for mindre kvote 2 optagelser, lavere SU, omlægning
                af alt SU til lån og færre studiepladser.{' '}
              </span>
              Det ønsker vi ikke. Medicinerrådet er upolitisk, men er stærkt imod deres politik.
              Medicinerrådet har hårdtarbejdende semesterrepræsentanter, som sikrer at vi er i
              løbende dialog med alle studerende og undervisere. Vi har en åben email tilknyttet en
              fast sekretær, hvor I altid kan komme i kontakt med os, og vi svarer altid på vores{' '}
              <a href="https://www.facebook.com/MedicinerraadAU" target="__blank">
                facebook side
              </a>
              .
            </p>
            <p>
              Stem på mig (Thomas Jensen) eller en anden repræsentant for medicinerrådet til
              universitetsvalget for at sikre din indflydelse på uddannelsen. Får medicinerrådet
              samlet 6 gange så mange stemmer som konservative studenter, holdes de ude af
              studienævnet.
            </p>
            <h2 style={{ textAlign: 'center' }}> Din stemme er meget vigtig! </h2>
            <Button fluid color="green">
              Stem på Thomas Jensen eller medicinerrådet nu. Af hjertet tak fra os alle.
            </Button>
            <p>
              Ps. tak fordi I bliver ved med at bruge systemet. Det er en stor fornøjelse at hjælpe
              så mange af jer med oplæsning til eksamen <Icon name="heart outline" />
            </p>
          </Grid.Row>
        </Grid.Column>
      </Grid>
    </Message>
  );
};

export default SelectionCountdown;
