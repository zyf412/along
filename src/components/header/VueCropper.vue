<template>
  <div>
      <div class="cropper-content">
        <div class="cropper" style="text-align:center">
        <vueCropper
            ref="cropper"
            :img="imgUrl"
            :outputSize="option.size"
            :outputType="option.outputType"
            :info="true"
            :full="option.full"
            :canMove="option.canMove"
            :canMoveBox="option.canMoveBox"
            :original="option.original"
            :autoCrop="option.autoCrop"
            :fixed="option.fixed"
            :fixedNumber="option.fixedNumber"
            :centerBox="option.centerBox"
            :infoTrue="option.infoTrue"
            :fixedBox="option.fixedBox"
          ></vueCropper>
        </div>
        <div class="btn">
                 <el-button size="small" type="danger" class="el-icon-zoom-in" @click="turnBig">放大</el-button>
                  <el-button size="small" type="danger" class="el-icon-zoom-out" @click="turnSmall">缩小</el-button>
                   <el-button size="small" type="danger" class="el-icon-refresh-left" @click="rotateLeft">左旋转</el-button>
                    <el-button size="small" type="danger" class="el-icon-refresh-right" @click="rotateRight">右旋转</el-button>
                 <el-button size="small" type="primary" @click="closeCropper">取消</el-button>
                 <el-button size="small" type="success" @click="finishCropper">确定</el-button>
        </div>
      </div>
  </div>
</template>

<script>
export default {
  props: ['imgUrl'],
  data () {
    return {
      ScaleNum: 0,
      option: {
        // img: '',  裁剪图片的地址 这里直接用props传递给 :img
        info: true, // 裁剪框的大小信息
        outputSize: 0.8, // 裁剪生成图片的质量
        outputType: 'jpeg', // 裁剪生成图片的格式
        canScale: false, // 图片是否允许滚轮缩放
        autoCrop: true, // 是否默认生成截图框
        // autoCropWidth: 300, // 默认生成截图框宽度
        // autoCropHeight: 200, // 默认生成截图框高度
        fixedBox: false, // 固定截图框大小 不允许改变
        fixed: false, // 是否开启截图框宽高固定比例
        fixedNumber: [7, 5], // 截图框的宽高比例
        full: true, // 是否输出原图比例的截图
        canMoveBox: true, // 截图框能否拖动
        original: false, // 上传图片按照原始比例渲染
        centerBox: false, // 截图框是否被限制在图片里面
        infoTrue: true // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
      }
    }
  },
  methods: {
    closeCropper () {
      this.$emit('closeCro', false)
    },
    finishCropper () {
      this.$refs.cropper.getCropBlob(data => {
        console.log(data)
        const file = new window.File([data], 'photo', { type: 'image/jpeg' })
        this.$emit('getImgFile', file)
      })
    },
    rotateLeft () {
      this.$refs.cropper.rotateLeft()
    },
    rotateRight () {
      this.$refs.cropper.rotateRight()
    },
    turnBig () {
      this.ScaleNum >= 0 ? this.ScaleNum = this.ScaleNum + 0.1 : this.ScaleNum = 0.1
    },
    turnSmall () {
      this.ScaleNum <= 0 ? this.ScaleNum = this.ScaleNum - 0.1 : this.ScaleNum = -0.1
    }
  },
  watch: {
    ScaleNum () {
      this.$refs.cropper.changeScale(this.ScaleNum)
    }
  }
}
</script>

<style lang='less' scoped>
    .cropper-content {
    .cropper {
        width: auto;
        height: 300px;
    }
    .btn {
        display: flex;
        justify-content: space-around;
        margin-top: 10px;
    }
}
</style>
