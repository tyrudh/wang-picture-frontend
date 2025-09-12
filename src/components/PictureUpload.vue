<template>
  <div class="picture-upload">
    <a-upload
      list-type="picture-card"
      :custom-request="handleUpload"
      :show-upload-list="false"
      :before-upload="beforeUpload"
    >
      <img v-if="picture?.url" :src="picture?.url" alt="avatar" />
      <div v-else>
        <loading-outlined v-if="loading"></loading-outlined>
        <plus-outlined v-else></plus-outlined>
        <div class="ant-upload-text">点击或拖拽上传图片</div>
      </div>
    </a-upload>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import type { UploadChangeParam, UploadProps } from 'ant-design-vue';
import { uploadPictureUsingPost } from '@/api/pictureController.ts'

interface Props{
  picture?: API.PictureVO;
  onSuccess?: (picture: API.PictureVO) => void;
}
const props = defineProps<Props>();

/*上传图片
* */
const handleUpload = async ({file}: any) => {
  try {
    loading.value = true;
    const params = props.picture ? {id: props.picture.id}: {};
    const res = await uploadPictureUsingPost(params, {}, file)
    if(res.data.data && res.data.code === 0){
      message.success('上传成功');
      props.onSuccess?.(res.data.data);
    }else {
      message.error('上传失败，' + res.data.message);
    }

    loading.value = false;
  }catch (e) {
    console.log(e);
  }


};


const loading = ref<boolean>(false);


/*上传前的校验
* */
const beforeUpload = (file: UploadProps['fileList'][number]) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('不支持上传该格式，推荐jpg或png');
  }
  const isLt5M = file.size / 1024 / 1024 < 5;
  if (!isLt5M) {
    message.error('不要上传大于5M的图片!');
  }
  return isJpgOrPng && isLt5M;
};
</script>
<style scoped>
.picture-upload :deep(.ant-upload) {
  width: 100% !important;
  height: 100% !important;
  min-height: 152px;
  min-width: 152px;
}
.picture-upload img{
  max-width: 100%;
  max-height: 480px;
}
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>
