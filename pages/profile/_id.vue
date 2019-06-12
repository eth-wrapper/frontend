<template>
  <div>
    <div class="row nosp mgb10 box-shadow-2">
      <div class="col-sm-12 mt-2 d-b-lt-600" style="background: #20a8d8;padding: 1em;">
        <div class="avatar-container" style="cursor: pointer; margin: auto" onclick="document.getElementById('profileSelectInput').click()">
          <img v-if="!!user.avatar" :src="user.avatar" alt="username">
          <img v-else src="/imgs/profile-empty.jpg" alt="username">
        </div>
      </div>
      <div class="col-lg-6 nosp pd10 d-fx-ic">
        <div class="fx-basis-2 d-n-lt-600">
          <div class="avatar-container" style="cursor: pointer" onclick="document.getElementById('profileSelectInput').click()">
            <img v-if="!!user.avatar" :src="user.avatar" alt="username">
            <img v-else src="/imgs/profile-empty.jpg" alt="username">
            <input id="profileSelectInput" type="file" style="display: none" @change="onAvatarSelect">
          </div>
        </div>
        <div class="fx-basis-8">
          <div class="pd10">
            <div class="d-fx-ic">
              <span class="fs-20 fx-basis-9">{{fullName}}</span>
              <span class="pfx-basis-1 number">
                <!--<i class="fa fa-star fa-sm"><strong>&nbsp;9.8</strong></i>-->
              </span>
            </div>
            <h6>{{user.about}}</h6>

            <div class="tbl-info-item clr-orange-l">
              <div><img style="width: 1.2em" src="/imgs/brightid-av-1.jpg" alt=""></div>
              <span>{{$t('pages.profile.infoBox.bidScore')}}:&nbsp;<strong class="clr-orange-l">{{user.brightIdScore}}</strong></span>
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-6 nosp pd10 d-fx">
        <div class="fx-basis-2 d-n-lt-600">
        </div>
        <div class="fx-basis-8 mgl10 tbl-info" style="border-left: 1px solid #f7f7f7;">
          <div class="pd10">
            <div class="d-fx-ic">
              <h6 class="fx-basis-5">{{$t('pages.profile.infoBox.location')}}:</h6>
              <span class="fx-basis-5">
                <i v-if="!!user.country" id="ir" title="us" class="flag-icon h6 mb-0" :class="userCountryFlag"></i>
                <span>{{userCountryName}}</span>
              </span>
            </div>
            <div class="d-fx-ic">
              <h6 class="fx-basis-5">{{$t('pages.profile.infoBox.joined')}}:</h6>
              <span :dir="pageDirection" class="fx-basis-5">{{userJoinDate}}</span>
            </div>
            <div class="d-fx-ic">
              <h6 class="fx-basis-5">{{$t('pages.profile.infoBox.lastSeen')}}:</h6>
              <span :dir="pageDirection" class="fx-basis-5">{{userLastSeen}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="isCurrentUser" class="row nosp mgb10 bd-1">
      <div class="col-md-6 pd10">
        <UpdateUsername />
        <UpdateEmail />
        <div class="form-space">&nbsp;</div>
        <div class="form-group">
          <label for="firstNameInput">{{$t('pages.profile.editBox.firstName.label')}}</label>
          <input class="form-control" v-model="firstName" id="firstNameInput" type="text" :placeholder="$t('pages.profile.editBox.firstName.placeholder')">
        </div>
        <div class="form-group">
          <label for="lastNameInput">{{$t('pages.profile.editBox.lastName.label')}}</label>
          <input class="form-control" v-model="lastName" id="lastNameInput" type="text" :placeholder="$t('pages.profile.editBox.lastName.placeholder')">
        </div>
        <div class="form-group">
          <label for="aboutInput">{{$t('pages.profile.editBox.about.label')}}</label>
          <input class="form-control" v-model="about" id="aboutInput" type="text" :placeholder="$t('pages.profile.editBox.about.placeholder')">
        </div>
        <div class="form-group">
          <label for="phone-number">{{$t('pages.profile.editBox.phone.label')}}</label>
          <input class="form-control" v-model="mobile" id="phone-number" type="text" :placeholder="$t('pages.profile.editBox.phone.placeholder')">
        </div>
        <button class="btn btn-sm btn-primary" type="submit" @click="saveUserData">
          <i class="fa fa-save fa-lg"></i>
          <span> Save changes</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapState, mapGetters} from 'vuex';
  import UpdateUsername from '../../components/UpdateUsername';
  import UpdateEmail from '../../components/UpdateEmail';
  import moment from 'moment';
  import VueStarRating from 'vue-star-rating';

  export default {
    layout: 'coreui',
    components: {UpdateUsername, UpdateEmail, VueStarRating},
    data() {
      return {
        user: null,
        feedbacks: [],
        id: null,
        firstName: "",
        lastName: "",
        about: "",
        country: "",
        mobile: "",
      }
    },
    asyncData ({ params, $axios, app }) {
//      if(params.id.toString() === app.store.$auth.user._id.toString())
//        return Promise.resolve(app.store.$auth.user);
      return $axios.post(`/api/v0.1/profile/get`, {userId: params.id, feedback: true})
          .then(({data}) => {
            if(data.success)
              return {
                user: data.user,
                feedbacks: data.feedbacks
              };
            return {user: null}
          })
    },
    mounted(){
      this.id = this.user._id;
      this.firstName = this.user.firstName;
      this.lastName = this.user.lastName;
      this.about = this.user.about;
      this.country = this.user.country || 'US';
      this.mobile = this.user.mobile || '';
    },
    computed: {
        ...mapState('auth', ['loggedIn']),
        ...mapGetters('locales', ['pageDirection']),
      isCurrentUser: function () {
        return this.user && this.user._id === this.$auth.user._id;
      },
      userCountryFlag: function () {
        return "flag-icon-" + this.user.country.toLowerCase();
      },
      userJoinDate: function () {
          return this.user.joinedInfo.title;
      },
      userLastSeen: function () {
          return this.user.lastSeenInfo.title;
      },
      usernameCrop: function () {
        if(this.user.username.length < 20)
          return this.user.username;
        else
          return this.user.username.substr(0,17) + '...';
      },
      fullName: function () {
        return `${this.user.firstName}\xa0${this.user.lastName}`.trim();
      }
    },
    methods: {
      feedbackDateTitle(feedback){
        return moment(feedback.updatedAt).format('YYYY-MM-DD HH:ss');
      },
      onAvatarSelect(){
        this.$toast.success('your avatar changed successfully');
      },
      saveUserData(){
        let {firstName, lastName, about, country, mobile} = this;
        this.$axios.post('/api/v0.1/user/update', {firstName, lastName, about, country, mobile})
            .then(({data}) => {
              if(data.success){
                this.$toast.success("Your profile updated successfully");
                this.$auth.fetchUser();
              }else{
                this.$toast.error(data.message || 'Server side error')
              }
            })
            .catch(error => {
              let {data} = error.response;
              this.$toast.error((data && data.message) ? data.message : 'server side error');
            })
      }
    }
  }

</script>

<style>
  .user-info-table {
    font-size: 1.2em;
  }
  .user-info-table td{
    padding: 0.5em 1em;
  }
  .user-info-table td:nth-child(1){
    font-weight: bold;
    padding-right: 3em;
  }
  .user-info-table tr:nth-child(even){
    background: #eee;
  }
  .avatar-container{
    width: 20em;
    height: 20em;
    border-radius: 25em;
    overflow: hidden;
    position: relative;
    /*border: 2px solid #aaa;*/

    -webkit-box-shadow: 0px 0px 4px 1px rgba(0,0,0,0.5);
    -moz-box-shadow: 0px 0px 4px 1px rgba(0,0,0,0.5);
    box-shadow: 0px 0px 4px 1px rgba(0,0,0,0.5);
  }
  @media only screen and (max-width: 1100px){
    .avatar-container {
      width: 15em;
      height: 15em;
    }
  }
  @media only screen and (max-width: 760px){
    .avatar-container {
      width: 10em;
      height: 10em;
    }
  }
  .d-b-lt-600{display: none}
  @media only screen and (max-width: 600px){
    .d-n-lt-600 {display: none}
    .d-b-lt-600 {display: block}
  }
  .avatar-container img{
    width: 100%;
    height: 100%;
  }
  .action-btn {
    width: 100%;
    padding: 0.5em 0;
    border-radius: 0.5em;
    background: #20a8d8;
    color: white;
    font-weight: bold;
    border: 1px solid #2088b6
  }
  .tbl-info{
    display: flex;
    height: 100%;
    justify-content: center;
    flex-flow: column nowrap;
  }
  .tbl-info-item{
    width: 100%;
    display: flex;
  }
  .tbl-info-item :nth-child(1){  flex-basis: 2em;  }
  .tbl-info-item :nth-child(2){  flex-basis: 90%;  }
</style>
