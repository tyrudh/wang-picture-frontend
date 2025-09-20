<template>
  <div id="addPicturePage">
    <ImageCropper imageUrl="https://avatars2.githubusercontent.com/u/15681693?s=460&v=4" />

    <h2 style="margin-bottom: 16px">
      {{route.query?.id ? '编辑图片' : '创建图片'}}
    </h2>
    <a-typography-paragraph v-if="spaceId" type="secondary">
      保存至空间：<a :href="`/space/${spaceId}`" target="_blank">{{ spaceId }}</a>
    </a-typography-paragraph>
    <!-- 选择上传方式 -->
    <a-tabs v-model:activeKey="uploadType"
    >>
      <a-tab-pane key="file" tab="文件上传">
        <PictureUpload :picture="picture" :spaceId="spaceId" :onSuccess="onSuccess" />
      </a-tab-pane>
      <a-tab-pane key="url" tab="URL 上传" force-render>
        <UrlPictureUpload :picture="picture" :spaceId="spaceId" :onSuccess="onSuccess" />
      </a-tab-pane>
    </a-tabs>
    <!--    图片信息表单-->
    <a-form v-if="picture" name="pictureForm" layout="vertical" :model="pictureForm" @finish="handleSubmit">
      <a-form-item name="name" label="名称">
        <a-input v-model:value="pictureForm.name" placeholder="请输入名称" allow-clear />
      </a-form-item>
      <a-form-item name="introduction" label="简介">
        <a-textarea v-model:value="pictureForm.introduction" placeholder="请输入简介" :auto-size="{minRows:2,maxRows:6}" allow-clear />
      </a-form-item>
      <a-form-item name="category" label="分类">
        <a-auto-complete
          v-model:value="pictureForm.category"
          placeholder="请输入分类"
          :options="categoryOptions"
          allow-clear
        />
      </a-form-item>
      <a-form-item name="tags" label="标签">
        <a-select
          v-model:value="pictureForm.tags"
          mode="tags"
          placeholder="请输入标签"
          :options="tagOptions"
          allow-clear
        />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit" style="width: 100%">创建</a-button>
      </a-form-item>

    </a-form>
    <div v-if="picture" class="edit-bar">
      <a-space size="middle">
        <a-button :icon="h(EditOutlined)" @click="doEditPicture">编辑图片</a-button>
        <a-button type="primary" ghost :icon="h(FullscreenOutlined)" @click="doImagePainting">
          AI 扩图
        </a-button>
      </a-space>
      <ImageOutPainting
        v-if="picture"
        ref="imageOutPaintingRef"
        :picture="picture"
        :spaceId="spaceId"
        :onSuccess="onImageOutPaintingSuccess"
      />
      <ImageCropper
        ref="imageCropperRef"
        :imageUrl="picture?.url"
        :picture="picture"
        :spaceId="spaceId"
        :onSuccess="onCropSuccess"
      />
    </div>
  </div>

</template>

<script setup lang="ts">
import PictureUpload from '@/components/PictureUpload.vue'
import UrlPictureUpload from '@/components/UrlPictureUpload.vue'
import { computed, h, onMounted, reactive, ref } from 'vue'
import { userLoginUsingPost } from '@/api/userController.ts'
import { message } from 'ant-design-vue'
import {
  editPictureUsingPost,
  getPictureByIdUsingGet,
  listPictureTagCategoryUsingGet
} from '@/api/pictureController.ts'

import { useRoute, useRouter } from 'vue-router'
import ImageCropper from '@/components/ImageCropper.vue'
import { EditOutlined,FullscreenOutlined } from '@ant-design/icons-vue'
import ImageOutPainting from '@/components/ImageOutPainting.vue'


const uploadType = ref<'file' | 'url'>('file')
const router = useRouter()
const picture = ref<API.PictureVO>()
const pictureForm = reactive<API.PictureEditRequest>({})
/*图片上传成功
* */
const onSuccess = (newPicture: API.PictureVO) => {
  picture.value = newPicture
  pictureForm.name = newPicture.name

}
// 空间 id
const spaceId = computed(() => {
  return route.query?.spaceId
})

/**
 * 提交表单
 * @param values
 */
const handleSubmit = async (values: any) => {
  const pictureId = picture.value?.id
  spaceId: spaceId.value
  if (!pictureId) {
    message.error('图片ID不存在')
    return
  }

  const res = await editPictureUsingPost({id: pictureId,...values})
  // 登录成功，把登录态保存到全局状态中
  if (res.data.code === 0 && res.data.data) {
    message.success('操作成功')
    router.push({
      path: `/picture/${pictureId}`,
    })
  } else {
    message.error('创建失败，' + res.data.message)
  }
}
const categoryOptions = ref<String[]>([])
const tagOptions = ref<String[]>([])
/*获取标签和分类标签
* */
const getTagCategoryOptions = async () => {

  const res = await listPictureTagCategoryUsingGet()
  if (res.data.code === 0 && res.data.data) {
    tagOptions.value = (res.data.data.tagList ??[]).map((data: string) => {
      return {
        value: data,
        label: data,
      }
    })
    categoryOptions.value = (res.data.data.categoryList ??[]).map((data: string) => {
      return {
        value: data,
        label: data,
      }
    })
  } else {
    message.error('获取标签和分类标签失败，' + res.data.message)
  }

}
onMounted(()=>{
  getTagCategoryOptions();
})
const route = useRoute();
//获取老数据
const getOldPicture = async () => {
  const id = route.query?.id
  if(id){
    const res = await getPictureByIdUsingGet({
      id
    })
    if(res.data.code === 0 && res.data.data){
      const data = res.data.data
      picture.value = data
      pictureForm.name = data.name
      pictureForm.introduction = data.introduction
      pictureForm.category = data.category
      pictureForm.tags = data.tags
    }
  }
}
onMounted(()=>{
  getOldPicture();
})
// 图片编辑弹窗引用
const imageCropperRef = ref()

// 编辑图片
const doEditPicture = () => {
  if (imageCropperRef.value) {
    imageCropperRef.value.openModal()
  }
}

// 编辑成功事件
const onCropSuccess = (newPicture: API.PictureVO) => {
  picture.value = newPicture
}

// AI 扩图弹窗引用
const imageOutPaintingRef = ref()

// AI 扩图
const doImagePainting = () => {
  if (imageOutPaintingRef.value) {
    imageOutPaintingRef.value.openModal()
  }
}

// 编辑成功事件
const onImageOutPaintingSuccess = (newPicture: API.PictureVO) => {
  picture.value = newPicture
}
</script>

<style scoped>
#addPicturePage {
  max-width: 720px;
  margin: 0 auto;
}
#addPicturePage .edit-bar {
  text-align: center;
  margin: 16px 0;
}
</style>
