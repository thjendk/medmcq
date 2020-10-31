import React from 'react';
import Countdown from 'react-countdown';
import { Button, Divider, Grid, Icon, Image, Message } from 'semantic-ui-react';
import moment from 'moment-timezone';
import image from './tj_profile.jpg';

interface SelectionCountdownProps {}

const SelectionCountdown = (props: SelectionCountdownProps) => {
  return (
    <Message style={{ border: '2px solid red' }}>
      <div style={{ textAlign: 'center', fontSize: '2em', color: 'red', fontWeight: 'bolder' }}>
        <Countdown date={moment('2020-11-13').toDate()} />
        <Divider />
        <h2 style={{ textAlign: 'center' }}>
          Jeg har brug for din hjælp! Stem til universitetsvalget inden d. 12 November!
        </h2>
      </div>
      <Grid stackable columns="equal">
        <Grid.Column verticalAlign="middle" width="4">
          <Grid.Row>
            <Image src={image} size="medium" />
            <p style={{ textAlign: 'center' }}>Thomas Jensen</p>
          </Grid.Row>
        </Grid.Column>
        <Grid.Column>
          <Grid.Row verticalAlign="middle">
            <p>
              De sidste 3 år har jeg repræsenteret medicin i studienævnet, og har gennem denne
              indflydelse blandt andet sikret, at MedMCQ er frit tilgængeligt for alle studerende og
              hvert semester indeholder de nyeste eksamenssæt.{' '}
              <span style={{ color: 'navy' }}>
                Så længe vi har indflydelse hos ledelsen, vil jeg kæmpe for at dette ikke ændrer sig
              </span>
              . Det er blot én af de ting, som vi i medicinerrådet har sikret de seneste år, og du
              kan finde langt mere information på vores{' '}
              <a href="https://www.facebook.com/MedicinerraadAU" target="__blank">
                facebook side
              </a>
              .
            </p>
            <h3 style={{ textAlign: 'center' }}>
              Der er normalt fredsvalg, men ikke i år. Derfor har vi brug for din hjælp!
            </h3>
            <p>
              Konservative studenter er i år gået imod mod medicinerrådet. De er et bred politisk
              parti som repræsentere hele universitet, og ikke kun de studerende på medicin. De går
              ind for{' '}
              <span style={{ color: 'red' }}>
                mindre kvote 2 optagelser, lavere SU, omlægning af alt SU til lån, og færre
                studiepladser
              </span>
              . Det ønsker vi ikke. Medicinerrådet er upolitisk, men vi er kraftigt imod deres
              politik. Medicinerrådet har repræsentanter som lægger et stort arbejde på alle
              semestre, og som sikrer, at vi er i løbende dialog med alle studerende og undervisere.
              Vi har en åben email tilknyttet en fast sekretær, hvor I altid kan komme i kontakt med
              os.
              <p>
                Stem på mig (Thomas Jensen) eller en anden repræsentant for medicinerrådet til
                universitetsvalget for at sikre din indflydelse på uddannelsen. Får medicinerrådet
                samlet 6 gange så mange stemmer som konservative studenter, holdes de ude af
                studienævnet.
              </p>
              <p
                style={{
                  textAlign: 'center',
                  textDecoration: 'underline',
                  fontWeight: 'bold',
                  fontSize: '1.2em'
                }}
              >
                Din stemme er meget vigtig!
              </p>
            </p>
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
