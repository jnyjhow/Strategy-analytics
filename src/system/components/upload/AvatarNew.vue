<template>
  <div class="avatar-new q-px-sm" style="align-content: center">
    <q-inner-loading
      :showing="loading"
      label="Please wait..."
      label-class="text-teal"
      label-style="font-size: 1.1em"
    />
    <q-avatar
      size="8rem"
      @mouseover="setUpload()"
      @mouseleave="hoverImage = false"
      class="avatar-control q-ma-sm"
      v-if="data.account"
      square
    >
      <img
        :src="data.account.avatar"
        :class="{ 'avatar-control-h': hoverImage }"
        style="border-radius: 50% !important"
      />
      <q-icon
        v-if="hoverImage"
        color="white"
        class="absolute"
        @click.prevent="openFile()"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="17"
          height="16"
          viewBox="0 0 17 16"
          fill="white"
        >
          <path
            d="M1.61816 12.8718V5.36443C1.61816 4.93432 1.76968 4.56775 2.07271 4.26472C2.37574 3.96169 2.74231 3.81018 3.17242 3.81018H4.38943C4.54583 3.81018 4.69246 3.77352 4.82931 3.7002C4.96616 3.62689 5.07857 3.52181 5.16655 3.38496L5.67975 2.62249C5.8166 2.40744 6.00233 2.23882 6.23693 2.11663C6.47154 1.99444 6.71592 1.93334 6.97007 1.93334H10.0199C10.2741 1.93334 10.5185 1.99444 10.7531 2.11663C10.9877 2.23882 11.1734 2.40744 11.3102 2.62249L11.8234 3.38496C11.9114 3.52181 12.0238 3.62689 12.1607 3.7002C12.2975 3.77352 12.4442 3.81018 12.6006 3.81018H13.8176C14.2477 3.81018 14.6143 3.96169 14.9173 4.26472C15.2203 4.56775 15.3718 4.93432 15.3718 5.36443V12.8718C15.3718 13.3116 15.2203 13.6831 14.9173 13.9861C14.6143 14.2892 14.2477 14.4407 13.8176 14.4407H3.17242C2.74231 14.4407 2.37574 14.2892 2.07271 13.9861C1.76968 13.6831 1.61816 13.3116 1.61816 12.8718ZM2.234 12.8718C2.234 13.1357 2.32686 13.3581 2.51259 13.5389C2.69832 13.7198 2.91826 13.8102 3.17242 13.8102H13.8176C14.0717 13.8102 14.2917 13.7198 14.4774 13.5389C14.6631 13.3581 14.756 13.1357 14.756 12.8718V5.36443C14.756 5.11027 14.6631 4.89033 14.4774 4.7046C14.2917 4.51888 14.0717 4.42601 13.8176 4.42601H12.6006C12.3464 4.42601 12.102 4.36492 11.8674 4.24273C11.6328 4.12054 11.4471 3.95192 11.3102 3.73686L10.797 2.9744C10.7091 2.83755 10.5967 2.73246 10.4598 2.65915C10.323 2.58584 10.1763 2.54918 10.0199 2.54918H6.97007C6.81367 2.54918 6.66704 2.58584 6.53019 2.65915C6.39334 2.73246 6.28092 2.83755 6.19294 2.9744L5.67975 3.73686C5.5429 3.95192 5.35717 4.12054 5.12256 4.24273C4.88796 4.36492 4.64358 4.42601 4.38943 4.42601H3.17242C2.91826 4.42601 2.69832 4.51888 2.51259 4.7046C2.32686 4.89033 2.234 5.11027 2.234 5.36443V12.8718ZM8.495 12.5638C7.97691 12.5638 7.48815 12.4661 7.02872 12.2706C6.57906 12.0751 6.18317 11.8063 5.84104 11.4641C5.49891 11.122 5.23009 10.7261 5.03459 10.2765C4.83908 9.81702 4.74133 9.32826 4.74133 8.81018C4.74133 8.29209 4.83908 7.80333 5.03459 7.3439C5.23009 6.89424 5.49891 6.49835 5.84104 6.15622C6.18317 5.81409 6.57906 5.54527 7.02872 5.34977C7.48815 5.15426 7.97691 5.05651 8.495 5.05651C9.01308 5.05651 9.50184 5.15426 9.96127 5.34977C10.4109 5.54527 10.8068 5.81409 11.149 6.15622C11.4911 6.49835 11.7599 6.89424 11.9554 7.3439C12.1509 7.80333 12.2487 8.29209 12.2487 8.81018C12.2487 9.32826 12.1509 9.81702 11.9554 10.2765C11.7599 10.7261 11.4911 11.122 11.149 11.4641C10.8068 11.8063 10.4109 12.0751 9.96127 12.2706C9.50184 12.4661 9.01308 12.5638 8.495 12.5638ZM8.495 11.9333C8.9251 11.9333 9.33077 11.8551 9.71201 11.6987C10.0932 11.5326 10.4256 11.3077 10.7091 11.0243C10.9926 10.7408 11.2174 10.4084 11.3836 10.0272C11.54 9.64595 11.6182 9.24028 11.6182 8.81018C11.6182 8.38007 11.54 7.9744 11.3836 7.59317C11.2174 7.21194 10.9926 6.87958 10.7091 6.5961C10.4256 6.31262 10.0932 6.08779 9.71201 5.92161C9.33077 5.76521 8.9251 5.68701 8.495 5.68701C8.06489 5.68701 7.65922 5.76521 7.27799 5.92161C6.89676 6.08779 6.5644 6.31262 6.28092 6.5961C5.99744 6.87958 5.77261 7.21194 5.60643 7.59317C5.45003 7.9744 5.37183 8.38007 5.37183 8.81018C5.37183 9.24028 5.45003 9.64595 5.60643 10.0272C5.77261 10.4084 5.99744 10.7408 6.28092 11.0243C6.5644 11.3077 6.89676 11.5326 7.27799 11.6987C7.65922 11.8551 8.06489 11.9333 8.495 11.9333Z"
            fill="white"
          />
        </svg>
      </q-icon>
      <input
        type="file"
        class="invisible"
        id="image"
        accept="image/*"
        ref="avatar"
        name="avatar"
        @change="getImage($event)"
        :disabled="loading"
      />
    </q-avatar>
    <q-btn
      label="upload"
      color="indigo-14"
      @click="upload"
      v-if="buttonSubmit"
      :disabled="loading"
    />
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import { useUserStore } from "../../../stores/user";
import { storeToRefs } from "pinia";
import useLogin from "../../../composables/useLogin";
import useAccount from "../../../composables/system/Requests/useAccount";
export default defineComponent({
  name: "AvatarNew",
  setup() {
    const hoverImage = ref(false);
    const setUpload = () => {
      hoverImage.value = true;
    };
    const form = ref({ name: "" });
    const setImage = ref(true);
    const useStore = useUserStore();
    const { data } = storeToRefs(useStore);
    const selectFile = ref("");
    const avatar = ref(null);
    const { UploadAvatar } = useLogin();
    const { loading, sendAvatar, buttonSubmit } = useAccount();
    const openFile = () => {
      avatar.value.click();
    };
    const getImage = (e) => {
      let image = e.target.files[0];
      console.log(" .....", image);
      selectFile.value = image;
      form.value.name = selectFile.value.name;
      let reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = (e) => {
        UploadAvatar(e.target.result);
        setImage.value = false;
        buttonSubmit.value = true;
      };
    };
    const upload = async () => {
      loading.value = true;
      let formData = new FormData();
      formData.append("avatar", selectFile.value, selectFile.value.name);
      // setTimeout(() => {
      //   loading.value = false;
      // }, 1500);
      await sendAvatar(formData);
      // const url = `${baseApiUrl}/${this.user.type}/avatar`;
      // const auth = JSON.parse(localStorage.getItem(userKey));
      // axios.defaults.headers.common["Authorization"] = `bearer ${auth.token}`;
      // axios.defaults.headers.common["Accept"] = "form-data";
      // axios
      //   .post(url, formData)
      //   .then((res) => {
      //     this.setImage = true;
      //     showSuccess(res.data.success);
      //   })
      //   .catch((e) => showError(e));
      console.log(formData);
    };

    return {
      avatar,
      data,
      selectFile,
      setImage,
      form,
      hoverImage,
      openFile,
      getImage,
      upload,
      setUpload,
      buttonSubmit,
      loading,
    };
  },
  // Outras configurações do componente aqui
});
</script>

<style scoped>
/* Estilos específicos do componente aqui */

.avatar-control {
  cursor: pointer;
}
.rounded:hover {
  opacity: 0.2;
}
.edit-avatar {
  cursor: pointer;
  margin-left: -57px;
  margin-right: 47px;
  opacity: 0;
}
.avatar-control-h {
  opacity: 0.2;
  border-radius: 50%;
}
.custom-file {
  width: 70%;
  height: 2rem;
}
.custom-file-label {
  border: 1px solid #4855bb !important;
  border-radius: 0.5rem !important;
}
</style>
