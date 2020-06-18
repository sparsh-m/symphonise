import React from "react";
import Spotify from "spotify-web-api-js";
import AlertContainer from "react-alert";

// component imports
import Header from "./components/Header/Header";
import BigButton from "./components/Button";
import PlaylistSelector from "./components/PlaylistSelector/PlaylistSelector";
import SliderSelector from "./components/Slider/SliderSelector";
import Player from "./components/Player/Player";
import SongStatistics from "./components/SongStats/SongStatistics";
import RadarSection from "./components/Radar/RadarSection";

// css imports
import "./styles/buttons.css";
import "./styles/compiled-player.css";
import "./styles/main.css";
import "./styles/slider.css";

import playlists from "./content/playlists/playlists";
import exclamation from "./content/alert-icons/exclamation.png";

const calcAndSort = (data, dataDetails, state) => {
  /* big huge function start */
  let calculatedData = [];
  let trackIds = [];

  // enter entire dataset loop for each song
  for (let i = 0; i < data.length; i++) {
    let songObj = data[i].track;
    let songDetails = dataDetails.find(songDetailSet => {
      return songDetailSet.id === songObj.id;
    });

    let trackId = songObj.id;
    trackIds.push(trackId);

    let trackDetails = songDetails;

    let trackEnergy = Math.round(trackDetails.energy * 100) || 0;
    let trackValence = Math.round(trackDetails.valence * 100) || 0;
    let trackAcousticness = Math.round(trackDetails.acousticness * 100) || 0;
    let trackDance = Math.round(trackDetails.danceability * 100) || 0;
    let trackVocalness =
      Math.abs(Math.round(trackDetails.instrumentalness * 100 - 100)) || 0;
    let trackPopularity = Math.abs(Math.round(songObj.popularity));

    let differenceEnergy = 0;
    let differenceValence = 0;
    let differenceAcousticness = 0;
    let differenceDance = 0;
    let differenceVocalness = 0;
    let differencePopularity = 0;
    if (state.filterBy.energy) {
      differenceEnergy = Math.abs(trackEnergy - state.energyValue);
    }
    if (state.filterBy.valence) {
      differenceValence = Math.abs(trackValence - state.valenceValue);
    }
    if (state.filterBy.acoustic) {
      differenceAcousticness = Math.abs(
        trackAcousticness - state.acousticValue
      );
    }
    if (state.filterBy.dance) {
      differenceDance = Math.abs(trackDance - state.danceValue);
    }
    if (state.filterBy.vocalness) {
      differenceVocalness = Math.abs(trackVocalness - state.vocalnessValue);
    }
    if (state.filterBy.popularity) {
      differencePopularity = Math.abs(trackPopularity - state.popularityValue);
    }
    let totalDifference =
      differenceEnergy +
      differenceValence +
      differenceAcousticness +
      differenceDance +
      differenceVocalness +
      differencePopularity;
    songObj["ResultDifference"] = totalDifference;
    if (songObj.preview_url !== null) {
      calculatedData.push(songObj);
    }
  }

  console.log(calculatedData);
  // sort by the absolute value of the subtracted entered user amount for each value and resort by that value
  calculatedData.sort(function(a, b) {
    return a.ResultDifference - b.ResultDifference;
  });
  console.log(calculatedData);

  return calculatedData;
};

const calcQueue = playlistNumber => {
  let queue = [];
  let data = playlists[playlistNumber].data.items;
  for (let i = 0; i < data.length; i++) {
    queue.push(data[i].track);
  }
  return queue;
};

class App extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      energyValue: 50,
      valenceValue: 50,
      acousticValue: 50,
      danceValue: 50,
      vocalnessValue: 50,
      popularityValue: 50,
      filterBy: {
        energy: true,
        valence: true,
        acoustic: true,
        dance: true,
        vocalness: true,
        popularity: true,
        genre: true
      },
      songRecommendation: playlists[0].data.items[0].track,
      params: {},
      queue: calcQueue(0),
      queueDetails: playlists[0].details,
      queuePosition: 0,
      createdPlaylist: false,
      selectedPlaylist: 0,
      };
    this.nextSong = this.nextSong.bind(this);
    this.prevSong = this.prevSong.bind(this);
  }

  componentWillMount() {}

  // handle playlist change
  handlePlaylistChange = value => {
    this.setState({
      selectedPlaylist: value,
      queue: calcQueue(value),
      queueDetails: playlists[value].details,
      songRecommendation: playlists[value].data.items[0].track,
      queuePosition: 0,
      seed_genres: ""
    });
    this.child.stopPlayback();
    let audio = document.getElementById("audio");
    audio.load();
  };
  // adjust slider values
  handleEnergyChange = value => {
    this.setState({ energyValue: value });
  };
  handleValenceChange = value => {
    this.setState({ valenceValue: value });
  };
  handleAcousticChange = value => {
    this.setState({ acousticValue: value });
  };
  handleDanceChange = value => {
    this.setState({ danceValue: value });
  };
  handleVocalnessChange = value => {
    this.setState({ vocalnessValue: value });
  };
  handlePopularityChange = value => {
    this.setState({ popularityValue: value });
  };
  // handle radio buttons to select what to filter by
  toggleEnergyFilter = () => {
    this.setState({
      filterBy: { ...this.state.filterBy, energy: !this.state.filterBy.energy }
    });
  };
  toggleValenceFilter = () => {
    this.setState({
      filterBy: {
        ...this.state.filterBy,
        valence: !this.state.filterBy.valence
      }
    });
  };
  toggleAcousticFilter = () => {
    this.setState({
      filterBy: {
        ...this.state.filterBy,
        acoustic: !this.state.filterBy.acoustic
      }
    });
  };
  toggleDanceFilter = () => {
    this.setState({
      filterBy: { ...this.state.filterBy, dance: !this.state.filterBy.dance }
    });
  };
  toggleVocalnessFilter = () => {
    this.setState({
      filterBy: {
        ...this.state.filterBy,
        vocalness: !this.state.filterBy.vocalness
      }
    });
  };
  togglePopularityFilter = () => {
    this.setState({
      filterBy: {
        ...this.state.filterBy,
        popularity: !this.state.filterBy.popularity
      }
    });
  };
  toggleGenreFilter = () => {
    this.setState({
      filterBy: { ...this.state.filterBy, genre: !this.state.filterBy.genre }
    });
  };

  // main calculation button
  handleClick = () => {
    this.child.stopPlayback();
    this.setState({ loading: true });
    
    const s = new Spotify();
    s.setAccessToken(this.state.params.access_token);

    // by default use the sample data
    let data = playlists[this.state.selectedPlaylist].data.items;
    let dataDetails = playlists[this.state.selectedPlaylist].details;
    let calculatedData = [];

    // use more specific data with API requests
    let options = {};
    if (this.state.filterBy.energy)
      options["target_energy"] = this.state.energyValue / 100;
    if (this.state.filterBy.valence)
      options["target_valence"] = this.state.valenceValue / 100;
    if (this.state.filterBy.acoustic)
      options["target_acousticness"] = this.state.acousticValue / 100;
    if (this.state.filterBy.dance)
      options["target_danceability"] = this.state.danceValue / 100;
    if (this.state.filterBy.vocalness)
      options["target_instrumentalness"] = this.state.vocalnessValue / 100;
    if (this.state.filterBy.popularity)
      options["target_popularity"] = this.state.popularityValue;
    if (this.state.filterBy.genre && this.state.seed_genres !== "")
      options["seed_genres"] = this.state.seed_genres;
    options["limit"] = 50;

    let formattedCalculations = [];
    if (this.state.filterBy.energy)
      formattedCalculations.push(`Energy: ${this.state.energyValue}`);
    if (this.state.filterBy.valence)
      formattedCalculations.push(`Valence: ${this.state.valenceValue}`);
    if (this.state.filterBy.acoustic)
      formattedCalculations.push(`Acoustic: ${this.state.acousticValue}`);
    if (this.state.filterBy.dance)
      formattedCalculations.push(`Dance: ${this.state.danceValue}`);
    if (this.state.filterBy.vocalness)
      formattedCalculations.push(`Vocalness: ${this.state.vocalnessValue}`);
    if (this.state.filterBy.popularity)
      formattedCalculations.push(`Popularity: ${this.state.popularityValue}`);
    if (this.state.filterBy.genre && this.state.seed_genres !== "")
      formattedCalculations.push(`Genres: ${this.state.seed_genres}`);
    const calculationsString = formattedCalculations.join(", ");

    try {
        calculatedData = calcAndSort(data, dataDetails, this.state);
        if (this.state.params.access_token) {
          s.containsMySavedTracks([calculatedData[0].id])
            .then(response => {
              this.setState({ songInLibrary: response[0] });
            })
            .catch(function(error) {
              console.error(error);
            });
        }
        // final assignment of top calculated track, remove loading, and load the queue
        this.setState({
          songRecommendation: calculatedData[0],
          loading: false,
          queue: calculatedData,
          queueDetails: dataDetails,
          queuePosition: 0,
          createdPlaylist: false,
          calculations: calculationsString
        });
        let audio = document.getElementById("audio");
        audio.load();
    } catch (err) {
      this.showError();
      console.log(err);
      this.setState({ loading: false });
    }
    // this.setState({ loading: false });
  };

  prevSong = () => {
    this.setState({ loading: true });
    let state = this.state;
    let newQueuePosition = state.queuePosition - 1;
    if (newQueuePosition < 0) {
      newQueuePosition = 0;
      this.showFirstSong();
    }
    
    this.setState({
      queuePosition: newQueuePosition,
      songRecommendation: state.queue[newQueuePosition]
    });
    let audio = document.getElementById("audio");
    audio.load();
    this.child.stopPlayback();
    this.setState({ loading: false });
  
  };
  nextSong = () => {
    this.setState({ loading: true });
    let state = this.state;
    let newQueuePosition = state.queuePosition + 1;
    if (newQueuePosition >= state.queue.length) {
      newQueuePosition = state.queuePosition;
      this.showLastSong();
    }
    
    this.setState({
      queuePosition: newQueuePosition,
      songRecommendation: state.queue[newQueuePosition]
    });
    let audio = document.getElementById("audio");
    audio.load();
    this.child.stopPlayback();
    this.setState({ loading: false });
    
  };
  

  // react alert messages and options
  alertOptions = {
    offset: 14,
    position: "bottom right",
    theme: "dark",
    time: 5000,
    transition: "fade"
  };
  showFirstSong = () => {
    this.msg.show(
      "First song in results reached, move through songs with the right arrow",
      {
        time: 4000,
        type: "error",
        icon: (
          <img
            alt="icon alert"
            style={{ height: 32, width: 32 }}
            src={exclamation}
          />
        )
      }
    );
  };
  showLastSong = () => {
    this.msg.show("Last song in results set reached", {
      time: 4000,
      type: "error",
      icon: (
        <img
          alt="icon alert"
          style={{ height: 32, width: 32 }}
          src={exclamation}
        />
      )
    });
  };
  

  render() {
    const {
      energyValue,
      valenceValue,
      acousticValue,
      danceValue,
      popularityValue,
      vocalnessValue,
      songRecommendation
    } = this.state;
    return (
      <div className="App">
        <Header params={this.state.params} me={this.state.me} />
        <div className="playlist-selector">
          <PlaylistSelector
            onChange={this.handlePlaylistChange}
            playlists={playlists}
          />
        </div>
        <SliderSelector
          label="ENERGY"
          value={energyValue}
          onChange={this.handleEnergyChange}
          toggleFilter={this.toggleEnergyFilter}
          filterOn={this.state.filterBy.energy}
        />
        <SliderSelector
          label="VALENCE"
          value={valenceValue}
          onChange={this.handleValenceChange}
          toggleFilter={this.toggleValenceFilter}
          filterOn={this.state.filterBy.valence}
        />
        <SliderSelector
          label="ACOUSTIC"
          value={acousticValue}
          onChange={this.handleAcousticChange}
          toggleFilter={this.toggleAcousticFilter}
          filterOn={this.state.filterBy.acoustic}
        />
        <SliderSelector
          label="DANCE"
          value={danceValue}
          onChange={this.handleDanceChange}
          toggleFilter={this.toggleDanceFilter}
          filterOn={this.state.filterBy.dance}
        />
        <SliderSelector
          label="POPULARITY"
          value={popularityValue}
          onChange={this.handlePopularityChange}
          toggleFilter={this.togglePopularityFilter}
          filterOn={this.state.filterBy.popularity}
        />
        <SliderSelector
          label="VOCALNESS"
          value={vocalnessValue}
          onChange={this.handleVocalnessChange}
          toggleFilter={this.toggleVocalnessFilter}
          filterOn={this.state.filterBy.vocalness}
        />
        <div className="calculateButton-section">
          <BigButton
            type="button"
            className="calculateButton"
            value="Calculate"
            onClick={this.handleClick}
            disabled={this.state.loading}
          />
        </div>
        <div className="song-info">
          <div>
            <div className="player-section">
              <RadarSection
                energyValue={this.state.energyValue}
                valenceValue={this.state.valenceValue}
                acousticValue={this.state.acousticValue}
                danceValue={this.state.danceValue}
                popularityValue={this.state.popularityValue}
                vocalnessValue={this.state.vocalnessValue}
                track={songRecommendation}
                trackDetails={
                  this.state.queueDetails.filter(
                    object => object.id === songRecommendation.id
                  )[0]
                }
              />
              <SongStatistics
                track={songRecommendation}
                trackDetails={
                  this.state.queueDetails.filter(
                    object => object.id === songRecommendation.id
                  )[0]
                }
              />
              <Player
                access_token={this.state.params.access_token}
                trackId={songRecommendation.id}
                track={{
                  name: songRecommendation.name,
                  artist: songRecommendation.artists[0].name,
                  album: songRecommendation.album.name,
                  artwork: songRecommendation.album.images[0].url,
                  duration: 30,
                  source: songRecommendation.preview_url
                }}
                ref={ref => (this.child = ref)}
                songInLibrary={this.state.songInLibrary}
                nextSong={this.nextSong}
                prevSong={this.prevSong}
                addPlaylist={this.addPlaylist}
                createdPlaylist={this.state.createdPlaylist}
              />
            </div>
          </div>
        </div>
        <AlertContainer ref={a => (this.msg = a)} {...this.alertOptions} />
      </div>
    );
  }
}

export default App;
