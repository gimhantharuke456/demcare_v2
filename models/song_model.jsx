class SongModel {
    
    constructor(url, artist, category, ageRange) {
      this.url = url;
      this.artist = artist;
      this.category = category;
      this.ageRange = ageRange;
    }
  
    // Getter methods
    getUrl() {
      return this.url;
    }
  
    getArtist() {
      return this.artist;
    }
  
    getCategory() {
      return this.category;
    }
  
    getAgeRange() {
      return this.ageRange;
    }
  
    // Setter methods
    setUrl(url) {
      this.url = url;
    }
  
    setArtist(artist) {
      this.artist = artist;
    }
  
    setCategory(category) {
      this.category = category;
    }
  
    setAgeRange(ageRange) {
      this.ageRange = ageRange;
    }
  }
  
  export default SongModel;
  