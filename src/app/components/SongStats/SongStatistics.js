import React, { Component } from "react";
import glamorous from "glamorous";
import StatGraphRow from "./StatGraphRow";
import {
  KeySignatures,
  StatRow,
  StatTitle,
  StatTag,
  StatLabel,
  StatValue,
  StatGraphHolder,
  StatGraph,
  StatText
} from "./StatElements";

const Title = glamorous.div({
  color: "#eee",
  fontSize: 26,
  marginBottom: 25,
  textAlign: "left"
});
const Subtitle = glamorous.div({
  color: "#eee",
  fontSize: 18,
  marginTop: 10,
  marginBottom: 20,
  textAlign: "left"
});

class SongStatistics extends Component {
  render() {
    const { track, trackDetails } = this.props;
    return (
      <div className="stats-section">
        <Title>Audio Analysis</Title>
        <StatGraphRow
          label="Energy"
          detailName="energy"
          track={track}
          trackDetails={trackDetails}
        />
        <StatGraphRow
          label="Valence"
          detailName="valence"
          track={track}
          trackDetails={trackDetails}
        />
        <StatGraphRow
          label="Acoustic"
          detailName="acousticness"
          track={track}
          trackDetails={trackDetails}
        />
        <StatGraphRow
          label="Dance"
          detailName="danceability"
          track={track}
          trackDetails={trackDetails}
        />
        <StatRow>
          <StatTitle>Popularity</StatTitle>
          <StatValue>{track.popularity.toFixed(0)}</StatValue>
          <StatGraphHolder>
            <StatGraph style={{ width: `${track.popularity}%` }}> </StatGraph>
          </StatGraphHolder>
        </StatRow>
        <StatRow>
          <StatTitle>Vocalness</StatTitle>
          <StatValue>
            {Math.abs((trackDetails.instrumentalness * 100).toFixed(0) - 100)}
          </StatValue>
          <StatGraphHolder>
            <StatGraph
              style={{
                width: `${Math.abs(
                  (trackDetails.instrumentalness * 100).toFixed(0) - 100
                )}%`
              }}
            >
              {" "}
            </StatGraph>
          </StatGraphHolder>
        </StatRow>
        <Subtitle>
          Composite Score{" "}
          <span style={{ color: "#7fff4d" }}>
            {600 - track.ResultDifference || 0}
          </span>
        </Subtitle>
        <StatText>
          <StatTag>{track.explicit ? "EXPLICIT" : "CLEAN"}</StatTag>
        </StatText>
        <StatText>
          <StatTitle>BPM</StatTitle>
          <StatLabel>{trackDetails.tempo.toFixed(0)}</StatLabel>
          {/* <StatTitle style={{gridArea: 'title2'}}>BPM</StatTitle>
          <StatValue style={{gridArea: 'value2'}}>{(trackDetails.tempo).toFixed(0)}</StatValue>  */}
        </StatText>
        <StatText>
          <StatTitle>Key</StatTitle>
          <StatLabel>{KeySignatures[trackDetails.key]}</StatLabel>
        </StatText>
      </div>
    );
  }
}

export default SongStatistics;
