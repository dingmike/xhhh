<template>
  <div class="createPost-container">
    <el-form class="form-container" :model="postForm" :rules="rules" ref="postForm" label-width="80px">

      <div class="createPost-main-container">

        <!--商品主图片上传-->
        <el-row>
          <el-form-item label-width="45px" label="主图:" class="postInfo-container-item">
            <Upload v-model="postForm.gallery" :file-lists="postForm.gallery"></Upload>
          </el-form-item>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="商品标题" prop="name">
              <el-input v-model="postForm.info.name"></el-input>
            </el-form-item>

            <el-form-item label="卖点介绍" prop="introduce">
              <el-input v-model="postForm.info.goods_brief"></el-input>
            </el-form-item>


          </el-col>
        </el-row>
        <div class="form_divider"></div>
        <!--添加 规格-->
        <el-row :gutter="20" style="padding: 12px">
          <el-form-item label="商品规格"></el-form-item>
        </el-row>
        <el-form v-for="(spec, index) in postForm.specificationList" :key="index">
          <el-card style="margin-bottom: 20px;height: 12rem; background-color: #fff; padding: 6px">
            <el-row>
              <el-col :span="3">
                <el-form-item>规格名（如：颜色）:</el-form-item>
              </el-col>
              <el-col :span="4" style="padding: 0 5px">
                <el-form-item>
                  <el-select size="small" v-model="spec.name" filterable allow-create placeholder="选择或创建规格名"
                             @change="renderAddSpec(index, spec.name)">
                    <el-option
                      v-for="item in productSpecsOptions"
                      :key="item.id"
                      :value-key="item.id"
                      :label="item.name"
                      :value="item.name">
                    </el-option>
                  </el-select>
                </el-form-item>

              </el-col>
              <el-col :span="2" style="padding-left: 10px">
                <el-form-item>
                  <el-checkbox v-model="setAttributeImg">批量设置规格图片</el-checkbox>
                </el-form-item>
              </el-col>
            </el-row>
            <!--规格值-->
            <el-row v-if="spec.isShowValue">
              <el-col :span="3">
                <el-form-item>
                  规格值(如: 红色):
                </el-form-item>
              </el-col>
              <!--  <div v-for="specValue in spec.children">
                  {{specValue}}
                </div>-->
              <el-col style="padding: 0 5px" :span="2" v-for="(specValue, index2) in spec.valueList" :key="index2"
                      @mouseover.native="toggleShow(index, index2)" @mouseout.native="toggleShow(index, index2)">
                <el-form-item style="font-size: 12px">

                  <el-select size="small" v-model.trim.lazy="specValue.value" filterable allow-create placeholder=""
                             @change="addSpec(spec.valueList, specValue.value, index, specValueOptions, index2)">
                    <el-option
                      v-for="item in specValueOptions"
                      :key="item.id"
                      :label="item.value"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <i class="el-icon-error delete-spec" ref="" v-show="specValue.isShow"
                   @click="removeSpecValue(index, index2, specValue.value, specValueOptions)"></i>
              </el-col>
              <el-col :span="2" style="padding-left: 10px">
                <el-form-item>
                  <el-button icon="el-icon-plus" size="mini"
                             @click="addSpecsValue(spec.valueList, newSpecName[index], index, specValueOptions)" plain>
                    添加规格值
                  </el-button>
                </el-form-item>
              </el-col>
            </el-row>
            <!--规格值--end-->
            <i class="el-icon-delete delete-spec-box" @click.prevent="removeSpecs(spec)"></i>
            <!--<el-button @click.prevent="removeSpecs(spec)">删除</el-button>-->
          </el-card>

        </el-form>


        <el-row :gutter="20" style="padding: 12px">
          <el-button icon="el-icon-plus" size="mini" @click="addProductSku()" :disabled="disableValue" plain>添加规格
          </el-button>
        </el-row>


        <!--规格明细-->

        <el-row :gutter="20" style="padding: 12px">
          <el-form-item label="规格明细"></el-form-item>
        </el-row>
        <el-form>
          <el-table :data="specPrices" :key='key' border fit highlight-current-row style="width: 100%">
            <!--<el-table-column prop="name" label="fruitName" width="180"></el-table-column>-->
            <el-table-column :key='thead.name' v-for='thead in tableThead' :label="thead.name">
              <template slot-scope="scope">
                <span v-for="item in scope.row.specs" :key="item.id">
                  {{item.specValue}}
                </span>
                <!--{{scope.row.specs}}{{thead.name}}-->
              </template>
            </el-table-column>
            <!--    <el-table-column prop="" label="货号">
                  <template slot-scope="scope">
                    &lt;!&ndash;<el-input v-model="postForm.name"></el-input>&ndash;&gt;

                    <el-popover trigger="click" placement="top">
                      <p>货号:
                        <el-input size="mini" class="price-modi" v-model.number="scope.row.prices.marketPrice"></el-input>
                      </p>
                      <div style="text-align: right; margin: 0">
                        &lt;!&ndash; <el-button size="mini" type="text" @click="visible2 = false">取消</el-button> &ndash;&gt;
                        &lt;!&ndash; <el-button type="primary" size="mini" @click="visible2 = false">确定</el-button> &ndash;&gt;
                      </div>
                      <div slot="reference" class="name-wrapper">
                        {{ scope.row.prices.marketPrice }}
                      </div>
                    </el-popover>


                  </template>
                </el-table-column>-->
            <el-table-column prop="" label="*现价">
              <template slot-scope="scope">
                <!--<el-input v-model.number="scope.row.prices.retail_price"></el-input>-->

                <el-popover trigger="click" placement="top">
                  <el-row>
                    <el-form-item
                      label="现价:"
                      prop="prices.advicePrice">
                      <el-input type="prices.advicePrice" size="mini" class="price-modi"
                                v-model.number="scope.row.prices.retail_price"></el-input>
                    </el-form-item>

                  </el-row>
                  <div style="text-align: right; margin: 0">
                    <!--  <el-button size="mini" type="text" @click="visible2 = false">取消</el-button>
                      <el-button type="primary" size="mini" @click="visible2 = false">确定</el-button>-->
                  </div>
                  <div slot="reference" class="name-wrapper">
                    {{ scope.row.prices.retail_price === null || "" ? 0 : scope.row.prices.retail_price}}
                  </div>
                </el-popover>

              </template>
            </el-table-column>
            <el-table-column prop="" label="*原价">
              <template slot-scope="scope">
                <!--<el-input v-model.number="scope.row.prices.retail_price"></el-input>-->
                <el-popover trigger="click" placement="top">
                  <el-row>

                    <el-form-item
                      label="原价:"
                      prop="prices.marketPrice">
                      <el-input size="mini" type="prices.marketPrice" class="price-modi"
                                v-model.number="scope.row.prices.retail_price"></el-input>
                    </el-form-item>
                  </el-row>
                  <div style="text-align: right; margin: 0">
                    <!-- <el-button size="mini" type="text" @click="visible2 = false">取消</el-button> -->
                    <!-- <el-button type="primary" size="mini" @click="visible2 = false">确定</el-button> -->
                  </div>
                  <div slot="reference" class="name-wrapper">
                    {{ scope.row.prices.retail_price === null || "" ? 0 : scope.row.prices.retail_price}}
                  </div>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column prop="" label="*库存">
              <template slot-scope="scope">
                <!--<el-input v-model.number="scope.row.prices.goods_number"></el-input>-->
                <el-popover trigger="click" placement="top">
                  <el-row>
                    <el-form-item
                      label="库存:"
                      prop="prices.store">
                      <el-input size="mini" type="prices.store" class="price-modi"
                                v-model.number="scope.row.prices.goods_number"></el-input>
                    </el-form-item>
                  </el-row>
                  <div style="text-align: right; margin: 0">
                    <!-- <el-button size="mini" type="text" @click="visible2 = false">取消</el-button> -->
                    <!-- <el-button type="primary" size="mini" @click="visible2 = false">确定</el-button> -->
                  </div>
                  <div slot="reference" class="name-wrapper">
                    {{ scope.row.prices.goods_number === null || "" ? 0 : scope.row.prices.goods_number }}
                  </div>
                </el-popover>

              </template>
            </el-table-column>
            <el-table-column prop="" label="*图片">
              <template slot-scope="scope">
                <Upload-single v-model="scope.row.prices.pic_url" :value="scope.row.prices.pic_url"></Upload-single>
              </template>
            </el-table-column>
          </el-table>
        </el-form>


        <!--规格明细--end-->
        <!--添加规格 end-->


        <div class="form_divider"></div>

        <el-row style="padding: 12px 0">
          商品参数
        </el-row>
        <!--参数列表-->

        <el-form>
          <el-table :data="postForm.productParamsForm" fit
                    show-header
                    tooltip-effect="dark"
                    ref="multipleTable"
                    @selection-change="handleSelectionChange"
                    style="width: 100%">
            <el-table-column align="center" label="属性分类" width="180" v-loading="loading"
                             element-loading-text="请给我点时间！">
              <template slot-scope="scope">

                <el-select size="small" v-model="scope.row.attribute_category" filterable placeholder="请输入分类">
                  <el-option
                    v-for="item in specValueOptions"
                    :key="item.id"
                    :label="item.value"
                    :value="item.value">
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column align="center" label="属性名称" width="" v-loading="loading"
                             element-loading-text="请给我点时间！">
              <template slot-scope="scope">
                <el-input size="small" v-model="scope.row.attribute_name" auto-complete="off"></el-input>
              </template>
            </el-table-column>

            <el-table-column width="" align="center" label="属性描述">
              <template slot-scope="scope">
                <el-input size="small" v-model="scope.row.attribute_des" auto-complete="off"></el-input>
              </template>
            </el-table-column>
            <el-table-column width="100" align="center" label="操作">
              <template slot-scope="scope">

                <el-popover
                  placement="top"
                  width="100"
                  v-model="scope.row.isVisible">
                  <p>确定删除吗？</p>
                  <div style="text-align: right; margin: 0">
                    <el-button size="mini" type="text" @click="scope.row.isVisible = false">取消</el-button>
                    <el-button type="primary" size="mini"
                               @click="deleteProductAttribute(scope.$index, postForm.productParamsForm)">确定
                    </el-button>
                  </div>
                  <!--<el-button slot="reference">删除</el-button>-->
                  <el-button slot="reference"
                             type="danger"
                             icon="el-icon-delete" size="mini"
                             @click.native.prevent="scope.row.isVisible = true"></el-button>
                </el-popover>
              </template>
            </el-table-column>
          </el-table>
        </el-form>


        <!--参数列表--end-->
        <div class="form_divider"></div>
        <el-button icon="el-icon-plus" size="mini" @click="addProductAttribute()" plain>添加参数</el-button>


        <div class="form_divider"></div>

        <el-row style="padding: 12px 0">
          商品详情
        </el-row>
        <div class="editor-container">
          <tinymce :height=400 ref="editor" v-model="postForm.info.goods_desc"></tinymce>
        </div>

        <div class="form_divider"></div>

        <el-row style="padding: 20px 0">
          商品分类
        </el-row>
        <el-checkbox-group v-model="checkList" @change="handleCheckedCategoryChange">
          <el-checkbox v-for="category in categories" :label="category" :key="category">{{category}}</el-checkbox>
        </el-checkbox-group>
        <div class="form_divider"></div>

        <el-row style="padding: 20px 0">
          <el-button type="primary" :loading="false" @click="test">发布</el-button>
        </el-row>

      </div>
    </el-form>

  </div>
</template>

<script>
  import Tinymce from '@/components/Tinymce'
  import Upload from '@/components/Upload/mutilImage'
  import UploadSingle from '@/components/Upload/oneImage'
  import MDinput from '@/components/MDinput'
  import Multiselect from 'vue-multiselect'// 使用的一个多选框组件，element-ui的select不能满足所有需求
  import 'vue-multiselect/dist/vue-multiselect.min.css'// 多选框组件css
  import Sticky from '@/components/Sticky' // 粘性header组件
  import {validateURL} from '@/utils/validate'
  //  import {fetchArticle} from '@/api/article'
  import {fetchGoodDetail} from '@/api/goods'
  import {userSearch} from '@/api/remoteSearch'
  import {fetchGoodsList, searchGoods, downUpGoods, getSpecifications, getSpecValue} from '@/api/goods'

  const defaultForm = {
    info: {
      id: '',
      name: "母亲节礼物-舒适安睡组合",
      category_id: '',
      goods_sn: '',
      brand_id: 1001020,
      goods_number: 10,
      keywords: "",
      goods_brief: "安心舒适是最好的礼物",
      is_on_sale: 1,
      add_time: 0,
      sort_order: 1,
      is_delete: 0,
      attribute_category: 0,
      counter_price: 0,
      extra_price: 0,
      is_new: 1,
      goods_unit: "件",
      primary_pic_url: "http://yanxuan.nosdn.127.net/6f3e94fa4b44341bda5a73224d605896.jpg",
      list_pic_url: "http://yanxuan.nosdn.127.net/1f67b1970ee20fd572b7202da0ff705d.png",
      retail_price: 2598,
      sell_volume: 1533,
      primary_product_id: 1194000,
      unit_price: 0,
      promotion_desc: "限时购",
      promotion_tag: "",
      app_exclusive_price: 0,
      is_app_exclusive: 0,
      is_limited: 0,
      is_hot: 0,
      goods_desc: "<p><img src=\"http://yanxuan.nosdn.127.net/3ddfe10db43f7df33ba82ae7570ada80.jpg\" _src=\"http://yanxuan.nosdn.127.net/3ddfe10db43f7df33ba82ae7570ada80.jpg\" style=\"\"/></p><p><img src=\"http://yanxuan.nosdn.127.net/7682b7930b4776ce032f509c24a74a1e.jpg\" _src=\"http://yanxuan.nosdn.127.net/7682b7930b4776ce032f509c24a74a1e.jpg\" style=\"\"/></p><p><img src=\"http://yanxuan.nosdn.127.net/e0bb6a50e27681925c5bb26bceb67ef4.jpg\" _src=\"http://yanxuan.nosdn.127.net/e0bb6a50e27681925c5bb26bceb67ef4.jpg\" style=\"\"/></p><p><img src=\"http://yanxuan.nosdn.127.net/ba63b244c74ce06fda82bb6a29cc0f71.jpg\" _src=\"http://yanxuan.nosdn.127.net/ba63b244c74ce06fda82bb6a29cc0f71.jpg\" style=\"\"/></p><p><img src=\"http://yanxuan.nosdn.127.net/3c7808c3a4769bad5af4974782f08654.jpg\" _src=\"http://yanxuan.nosdn.127.net/3c7808c3a4769bad5af4974782f08654.jpg\" style=\"\"/></p><p><img src=\"http://yanxuan.nosdn.127.net/71798aaac23a91fdab4d77e1b980a4df.jpg\" _src=\"http://yanxuan.nosdn.127.net/71798aaac23a91fdab4d77e1b980a4df.jpg\" style=\"\"/></p><p><img src=\"http://yanxuan.nosdn.127.net/c88cbb2dd2310b732571f49050fe4059.jpg\" _src=\"http://yanxuan.nosdn.127.net/c88cbb2dd2310b732571f49050fe4059.jpg\" style=\"\"/></p><p><img src=\"http://yanxuan.nosdn.127.net/5dfdcd654e0f3076f7c05dd9c19c15ea.jpg\" _src=\"http://yanxuan.nosdn.127.net/5dfdcd654e0f3076f7c05dd9c19c15ea.jpg\" style=\"\"/></p><p><img src=\"http://yanxuan.nosdn.127.net/bd55d6ef7af69422d8d76af10ee70156.jpg\" _src=\"http://yanxuan.nosdn.127.net/bd55d6ef7af69422d8d76af10ee70156.jpg\" style=\"\"/></p><p><img src=\"http://yanxuan.nosdn.127.net/bae571b22954c521b35e446d652edc1d.jpg\" _src=\"http://yanxuan.nosdn.127.net/bae571b22954c521b35e446d652edc1d.jpg\" style=\"\"/></p><p><img src=\"http://yanxuan.nosdn.127.net/e709c4d9e46d602a4d2125e47110f6ae.jpg\" _src=\"http://yanxuan.nosdn.127.net/e709c4d9e46d602a4d2125e47110f6ae.jpg\" style=\"\"/></p><p><img src=\"http://yanxuan.nosdn.127.net/83e41915035c418db177af8b1eca385c.jpg\" _src=\"http://yanxuan.nosdn.127.net/83e41915035c418db177af8b1eca385c.jpg\" style=\"\"/></p><p><img src=\"http://yanxuan.nosdn.127.net/f42c561e6935fe3e0e0873653da78670.jpg\" _src=\"http://yanxuan.nosdn.127.net/f42c561e6935fe3e0e0873653da78670.jpg\" style=\"\"/></p><p><img src=\"http://yanxuan.nosdn.127.net/8317726fbae80b98764dc4c6233a913e.jpg\" _src=\"http://yanxuan.nosdn.127.net/8317726fbae80b98764dc4c6233a913e.jpg\" style=\"\"/></p><p><img src=\"http://yanxuan.nosdn.127.net/ba904b7c948b8015db2171435325270f.jpg\" _src=\"http://yanxuan.nosdn.127.net/ba904b7c948b8015db2171435325270f.jpg\" style=\"\"/></p><p><img src=\"http://yanxuan.nosdn.127.net/4969c73d0d8f29bffb69529c96ca4889.jpg\" _src=\"http://yanxuan.nosdn.127.net/4969c73d0d8f29bffb69529c96ca4889.jpg\" style=\"\"/></p><p><img src=\"http://yanxuan.nosdn.127.net/d80b9b8c5c31031d1cd5357e48748632.jpg\" _src=\"http://yanxuan.nosdn.127.net/d80b9b8c5c31031d1cd5357e48748632.jpg\" style=\"\"/></p><p><img src=\"http://yanxuan.nosdn.127.net/3fe79bdae40662a7b1feed3179d3dd1f.jpg\" _src=\"http://yanxuan.nosdn.127.net/3fe79bdae40662a7b1feed3179d3dd1f.jpg\" style=\"\"/></p><p><img src=\"http://yanxuan.nosdn.127.net/79eef059963b12479f65e782d1dca128.jpg\" _src=\"http://yanxuan.nosdn.127.net/79eef059963b12479f65e782d1dca128.jpg\" style=\"\"/></p><p><img src=\"http://yanxuan.nosdn.127.net/e5a8f64f4297ccc01b41df98b0f252c8.jpg\" _src=\"http://yanxuan.nosdn.127.net/e5a8f64f4297ccc01b41df98b0f252c8.jpg\" style=\"\"/></p><p><img src=\"http://yanxuan.nosdn.127.net/a940b9e9525c4861407e4c3b07b02977.jpg\" _src=\"http://yanxuan.nosdn.127.net/a940b9e9525c4861407e4c3b07b02977.jpg\" style=\"\"/></p><p><img src=\"http://yanxuan.nosdn.127.net/224b8b81cbe12e4ad060a50f1e26601a.jpg\" _src=\"http://yanxuan.nosdn.127.net/224b8b81cbe12e4ad060a50f1e26601a.jpg\" style=\"\"/></p><p><img src=\"http://yanxuan.nosdn.127.net/85e151647452fad718effb7b1adc18e2.jpg\" _src=\"http://yanxuan.nosdn.127.net/85e151647452fad718effb7b1adc18e2.jpg\" style=\"\"/></p><p><img src=\"http://yanxuan.nosdn.127.net/d47444ff3bb9dc0aa4ab1f9b84d83768.jpg\" _src=\"http://yanxuan.nosdn.127.net/d47444ff3bb9dc0aa4ab1f9b84d83768.jpg\" style=\"\"/></p><p><img src=\"http://yanxuan.nosdn.127.net/136262743f0c849cc0c55c8e7963dd7e.jpg\" _src=\"http://yanxuan.nosdn.127.net/136262743f0c849cc0c55c8e7963dd7e.jpg\" style=\"\"/></p><p><img src=\"http://yanxuan.nosdn.127.net/331a97cbaff5b25a3b08ed7cdfe29df9.jpg\" _src=\"http://yanxuan.nosdn.127.net/331a97cbaff5b25a3b08ed7cdfe29df9.jpg\" style=\"\"/></p><p><img src=\"http://yanxuan.nosdn.127.net/89b450aa0a8afe1db566dcad926f1fe8.jpg\" _src=\"http://yanxuan.nosdn.127.net/89b450aa0a8afe1db566dcad926f1fe8.jpg\" style=\"\"/></p><p><img src=\"http://yanxuan.nosdn.127.net/c1cf94f13b7280a97e751cebe573fa78.jpg\" _src=\"http://yanxuan.nosdn.127.net/c1cf94f13b7280a97e751cebe573fa78.jpg\" style=\"\"/></p><p><img src=\"http://yanxuan.nosdn.127.net/1822c23def83b77e7607c24237eeec74.jpg\" _src=\"http://yanxuan.nosdn.127.net/1822c23def83b77e7607c24237eeec74.jpg\" style=\"\"/></p><p><img src=\"http://yanxuan.nosdn.127.net/2af234312b3914d6d0bc316f92134614.jpg\" _src=\"http://yanxuan.nosdn.127.net/2af234312b3914d6d0bc316f92134614.jpg\" style=\"\"/></p><p><img src=\"http://yanxuan.nosdn.127.net/c4f8ab2b3813275d954a8bedcf902d26.jpg\" _src=\"http://yanxuan.nosdn.127.net/c4f8ab2b3813275d954a8bedcf902d26.jpg\" style=\"\"/></p><p><img src=\"http://yanxuan.nosdn.127.net/42f18842ff0c92ed849c4401ae47bb61.jpg\" _src=\"http://yanxuan.nosdn.127.net/42f18842ff0c92ed849c4401ae47bb61.jpg\" style=\"\"/></p><p><img src=\"http://yanxuan.nosdn.127.net/a8ea64a35799e50ab31ecb65345fe8f4.jpg\" _src=\"http://yanxuan.nosdn.127.net/a8ea64a35799e50ab31ecb65345fe8f4.jpg\" style=\"\"/></p><p><img src=\"http://yanxuan.nosdn.127.net/18759fa90cd153bdd744280807c3c155.jpg\" _src=\"http://yanxuan.nosdn.127.net/18759fa90cd153bdd744280807c3c155.jpg\" style=\"\"/></p><p><img src=\"http://yanxuan.nosdn.127.net/431f00d068a8e747959deb3b7bdd495a.jpg\" _src=\"http://yanxuan.nosdn.127.net/431f00d068a8e747959deb3b7bdd495a.jpg\" style=\"\"/></p><p><img src=\"http://yanxuan.nosdn.127.net/5bd3b44f1f4c627bfa39f7809e866ec6.jpg\" _src=\"http://yanxuan.nosdn.127.net/5bd3b44f1f4c627bfa39f7809e866ec6.jpg\" style=\"\"/></p><p><img src=\"http://yanxuan.nosdn.127.net/7fc36778fe2f6129b9c26e8298c5be7e.jpg\" _src=\"http://yanxuan.nosdn.127.net/7fc36778fe2f6129b9c26e8298c5be7e.jpg\" style=\"\"/></p><p><img src=\"http://yanxuan.nosdn.127.net/c568432e3d5ab6786cd9dcae8008891b.jpg\" _src=\"http://yanxuan.nosdn.127.net/c568432e3d5ab6786cd9dcae8008891b.jpg\" style=\"\"/></p><p><img src=\"http://yanxuan.nosdn.127.net/ec82ff5aecafa48807117da68cce2ce9.jpg\" _src=\"http://yanxuan.nosdn.127.net/ec82ff5aecafa48807117da68cce2ce9.jpg\" style=\"\"/></p><p><img src=\"http://yanxuan.nosdn.127.net/b8eccbed570da595e6f8a71ed4abc42c.jpg\" _src=\"http://yanxuan.nosdn.127.net/b8eccbed570da595e6f8a71ed4abc42c.jpg\" style=\"\"/></p><p><img src=\"http://yanxuan.nosdn.127.net/9cae1fed6ecefcd61435fe6e2c700fd6.jpg\" _src=\"http://yanxuan.nosdn.127.net/9cae1fed6ecefcd61435fe6e2c700fd6.jpg\" style=\"\"/></p><p><img src=\"http://yanxuan.nosdn.127.net/e306a418f82777399f5e88b93cca22db.jpg\" _src=\"http://yanxuan.nosdn.127.net/e306a418f82777399f5e88b93cca22db.jpg\" style=\"\"/></p><p><img src=\"http://yanxuan.nosdn.127.net/a66d717084e23864ce079f936557709f.jpg\" _src=\"http://yanxuan.nosdn.127.net/a66d717084e23864ce079f936557709f.jpg\" style=\"\"/></p><p><img src=\"http://yanxuan.nosdn.127.net/6ae06c6505cdbf87a0210fe3b8727d5f.jpg\" _src=\"http://yanxuan.nosdn.127.net/6ae06c6505cdbf87a0210fe3b8727d5f.jpg\" style=\"\"/></p><p><img src=\"http://yanxuan.nosdn.127.net/58ac2086725b0ba2fe800195f274a0b4.jpg\" _src=\"http://yanxuan.nosdn.127.net/58ac2086725b0ba2fe800195f274a0b4.jpg\" style=\"\"/></p><p><img src=\"http://yanxuan.nosdn.127.net/5e2e9d9eb099647fbe041ec6645ac034.jpg\" _src=\"http://yanxuan.nosdn.127.net/5e2e9d9eb099647fbe041ec6645ac034.jpg\" style=\"\"/></p><p><img src=\"http://yanxuan.nosdn.127.net/8154357c0fab82bd4e67cda9aaa128c0.jpg\" _src=\"http://yanxuan.nosdn.127.net/8154357c0fab82bd4e67cda9aaa128c0.jpg\" style=\"\"/></p><p><img src=\"http://yanxuan.nosdn.127.net/4325763b738ec3183ecf0d82b2b28e32.jpg\" _src=\"http://yanxuan.nosdn.127.net/4325763b738ec3183ecf0d82b2b28e32.jpg\" style=\"\"/></p><p><img src=\"http://yanxuan.nosdn.127.net/06d8ea9d10035a00f26c5c52cc601ca7.jpg\" _src=\"http://yanxuan.nosdn.127.net/06d8ea9d10035a00f26c5c52cc601ca7.jpg\" style=\"\"/></p><p><img src=\"http://yanxuan.nosdn.127.net/499f30b9e69b5dddf3db36f105756111.jpg\" _src=\"http://yanxuan.nosdn.127.net/499f30b9e69b5dddf3db36f105756111.jpg\" style=\"\"/></p><p><img src=\"http://yanxuan.nosdn.127.net/ed7e1733d54e711a560edb3a76f1a60c.jpg\" _src=\"http://yanxuan.nosdn.127.net/ed7e1733d54e711a560edb3a76f1a60c.jpg\" style=\"\"/></p><p><img src=\"http://yanxuan.nosdn.127.net/b6474347eebdb917d2e827fd526dd01c.jpg\" _src=\"http://yanxuan.nosdn.127.net/b6474347eebdb917d2e827fd526dd01c.jpg\" style=\"\"/></p><p><img src=\"http://yanxuan.nosdn.127.net/b2c0691f9204c5ebc94b4ff678919ca7.jpg\" _src=\"http://yanxuan.nosdn.127.net/b2c0691f9204c5ebc94b4ff678919ca7.jpg\" style=\"\"/></p><p><img src=\"http://yanxuan.nosdn.127.net/b4811e702a6884a9251d7cc9e3b06b6f.jpg\" _src=\"http://yanxuan.nosdn.127.net/b4811e702a6884a9251d7cc9e3b06b6f.jpg\" style=\"\"/></p><p><img src=\"http://yanxuan.nosdn.127.net/d518783c054695acf329e81d597fdec3.jpg\" _src=\"http://yanxuan.nosdn.127.net/d518783c054695acf329e81d597fdec3.jpg\" style=\"\"/></p><p><img src=\"http://yanxuan.nosdn.127.net/835ce09e785cca635c176008975053a1.jpg\" _src=\"http://yanxuan.nosdn.127.net/835ce09e785cca635c176008975053a1.jpg\" style=\"\"/></p><p><img src=\"http://yanxuan.nosdn.127.net/769af780de81a302c0a3b03ed8e6c528.jpg\" _src=\"http://yanxuan.nosdn.127.net/769af780de81a302c0a3b03ed8e6c528.jpg\" style=\"\"/></p><p><img src=\"http://yanxuan.nosdn.127.net/da34f99daf9141f0fe56a766461b8485.jpg\" _src=\"http://yanxuan.nosdn.127.net/da34f99daf9141f0fe56a766461b8485.jpg\" style=\"\"/></p><p><img src=\"http://yanxuan.nosdn.127.net/d7c9cd8722a2f9a78e158ce02ec5d4f2.jpg\" _src=\"http://yanxuan.nosdn.127.net/d7c9cd8722a2f9a78e158ce02ec5d4f2.jpg\" style=\"\"/></p><p><img src=\"http://yanxuan.nosdn.127.net/09ea18953884b15227819e326103462b.jpg\" _src=\"http://yanxuan.nosdn.127.net/09ea18953884b15227819e326103462b.jpg\" style=\"\"/></p><p><img src=\"http://yanxuan.nosdn.127.net/5ef728213983842edf1aec27b2c1f5b6.jpg\" _src=\"http://yanxuan.nosdn.127.net/5ef728213983842edf1aec27b2c1f5b6.jpg\" style=\"\"/></p><p><img src=\"http://yanxuan.nosdn.127.net/95409f2a884dcfeaabfe5e61fcf9ec37.jpg\" _src=\"http://yanxuan.nosdn.127.net/95409f2a884dcfeaabfe5e61fcf9ec37.jpg\" style=\"\"/></p><p><img src=\"http://yanxuan.nosdn.127.net/6807836dc2a940ba56ea10c7a63b14c9.jpg\" _src=\"http://yanxuan.nosdn.127.net/6807836dc2a940ba56ea10c7a63b14c9.jpg\" style=\"\"/></p><p><img src=\"http://yanxuan.nosdn.127.net/e1d976d06853e7a0e6c9cc4ab484ac8a.jpg\" _src=\"http://yanxuan.nosdn.127.net/e1d976d06853e7a0e6c9cc4ab484ac8a.jpg\" style=\"\"/></p><p><img src=\"http://yanxuan.nosdn.127.net/47f5673dec5005092f6d897d6335966c.jpg\" _src=\"http://yanxuan.nosdn.127.net/47f5673dec5005092f6d897d6335966c.jpg\" style=\"\"/></p><p><img src=\"http://yanxuan.nosdn.127.net/1b0109abd0e6a0d13fa2423a96c1167e.jpg\" _src=\"http://yanxuan.nosdn.127.net/1b0109abd0e6a0d13fa2423a96c1167e.jpg\" style=\"\"/></p><p><img src=\"http://yanxuan.nosdn.127.net/916111a8f94cc0bd39375b3dcac14e35.jpg\" _src=\"http://yanxuan.nosdn.127.net/916111a8f94cc0bd39375b3dcac14e35.jpg\" style=\"\"/></p><p><img src=\"http://yanxuan.nosdn.127.net/c1360df3d6b703c5df9b2f47a2a3d12e.jpg\" _src=\"http://yanxuan.nosdn.127.net/c1360df3d6b703c5df9b2f47a2a3d12e.jpg\" style=\"\"/></p><p><img src=\"http://yanxuan.nosdn.127.net/1d5a31eb93ef873a165993bd99f29df1.jpg\" _src=\"http://yanxuan.nosdn.127.net/1d5a31eb93ef873a165993bd99f29df1.jpg\" style=\"\"/></p><p><img src=\"http://yanxuan.nosdn.127.net/997a48948b89dd7261ed5a59ba884f45.jpg\" _src=\"http://yanxuan.nosdn.127.net/997a48948b89dd7261ed5a59ba884f45.jpg\" style=\"\"/></p><p><img src=\"http://yanxuan.nosdn.127.net/eb96d9689735c9f4019ebf76da43b2b2.jpg\" _src=\"http://yanxuan.nosdn.127.net/eb96d9689735c9f4019ebf76da43b2b2.jpg\" style=\"\"/></p><p><img src=\"http://yanxuan.nosdn.127.net/a92cf2172e6cafe080e4511205568d79.jpg\" _src=\"http://yanxuan.nosdn.127.net/a92cf2172e6cafe080e4511205568d79.jpg\" style=\"\"/></p><p><img src=\"http://yanxuan.nosdn.127.net/c9e94570428f197292bb3f43609963f5.jpg\" _src=\"http://yanxuan.nosdn.127.net/c9e94570428f197292bb3f43609963f5.jpg\" style=\"\"/></p><p><img src=\"http://yanxuan.nosdn.127.net/37145f06cce747311692ad7f276645db.jpg\" _src=\"http://yanxuan.nosdn.127.net/37145f06cce747311692ad7f276645db.jpg\" style=\"\"/></p><p><img src=\"http://yanxuan.nosdn.127.net/c9a698b71ed911364fc6f243006c241c.jpg\" _src=\"http://yanxuan.nosdn.127.net/c9a698b71ed911364fc6f243006c241c.jpg\" style=\"\"/></p><p><img src=\"http://yanxuan.nosdn.127.net/e89db969711efaa441c43d6b90498a0c.jpg\" _src=\"http://yanxuan.nosdn.127.net/e89db969711efaa441c43d6b90498a0c.jpg\" style=\"\"/></p><p><img src=\"http://yanxuan.nosdn.127.net/3803bb1a18229562f18943512b1d3524.jpg\" _src=\"http://yanxuan.nosdn.127.net/3803bb1a18229562f18943512b1d3524.jpg\" style=\"\"/></p><p><img src=\"http://yanxuan.nosdn.127.net/235cbb5be905ac2b87e7e8f7c8d90144.jpg\" _src=\"http://yanxuan.nosdn.127.net/235cbb5be905ac2b87e7e8f7c8d90144.jpg\" style=\"\"/></p><p><img src=\"http://yanxuan.nosdn.127.net/3e38435b3fdbae4ee80b83995592901e.jpg\" _src=\"http://yanxuan.nosdn.127.net/3e38435b3fdbae4ee80b83995592901e.jpg\" style=\"\"/></p><p><img src=\"http://yanxuan.nosdn.127.net/8ceb7cd3231585da60a74dd2c1aa9015.jpg\" _src=\"http://yanxuan.nosdn.127.net/8ceb7cd3231585da60a74dd2c1aa9015.jpg\" style=\"\"/></p><p><img src=\"http://yanxuan.nosdn.127.net/e151e225c2e30aab7ccf086094381577.jpg\" _src=\"http://yanxuan.nosdn.127.net/e151e225c2e30aab7ccf086094381577.jpg\" style=\"\"/></p><p><img src=\"http://yanxuan.nosdn.127.net/363c19306953daf10968f4aa86617997.jpg\" _src=\"http://yanxuan.nosdn.127.net/363c19306953daf10968f4aa86617997.jpg\" style=\"\"/></p><p><img src=\"http://yanxuan.nosdn.127.net/4237a392cf2e69b110ad4ecf35e44059.jpg\" _src=\"http://yanxuan.nosdn.127.net/4237a392cf2e69b110ad4ecf35e44059.jpg\" style=\"\"/></p><p><img src=\"http://yanxuan.nosdn.127.net/da8ab35ada2dfe55006db01efa96e51a.jpg\" _src=\"http://yanxuan.nosdn.127.net/da8ab35ada2dfe55006db01efa96e51a.jpg\" style=\"\"/></p><p><img src=\"http://yanxuan.nosdn.127.net/aa1d4fd00b7879db3f1051dc6d16aa87.jpg\" _src=\"http://yanxuan.nosdn.127.net/aa1d4fd00b7879db3f1051dc6d16aa87.jpg\" style=\"\"/></p><p><img src=\"http://yanxuan.nosdn.127.net/302a8f2d997ff22bedcd837672cdafc2.jpg\" _src=\"http://yanxuan.nosdn.127.net/302a8f2d997ff22bedcd837672cdafc2.jpg\" style=\"\"/></p><p><img src=\"http://yanxuan.nosdn.127.net/a39ff68c00522aef0472402958a334d2.jpg\" _src=\"http://yanxuan.nosdn.127.net/a39ff68c00522aef0472402958a334d2.jpg\" style=\"\"/></p><p><img src=\"http://yanxuan.nosdn.127.net/86ccd0eb677c8b552398869d11a8917e.jpg\" _src=\"http://yanxuan.nosdn.127.net/86ccd0eb677c8b552398869d11a8917e.jpg\" style=\"\"/></p><p><img src=\"http://yanxuan.nosdn.127.net/a6d0ede352da947060d912d903646a5d.jpg\" _src=\"http://yanxuan.nosdn.127.net/a6d0ede352da947060d912d903646a5d.jpg\" style=\"\"/></p><p><img src=\"http://yanxuan.nosdn.127.net/e6a118bf95bdb61891409d25f193e9c4.jpg\" _src=\"http://yanxuan.nosdn.127.net/e6a118bf95bdb61891409d25f193e9c4.jpg\" style=\"\"/></p><p><img src=\"http://yanxuan.nosdn.127.net/c214066e9bf65d60bcebd691b5b1cbc1.jpg\" _src=\"http://yanxuan.nosdn.127.net/c214066e9bf65d60bcebd691b5b1cbc1.jpg\" style=\"\"/></p><p><img src=\"http://yanxuan.nosdn.127.net/c301559ba3ee280bcbf2fc4269bfa9ca.jpg\" _src=\"http://yanxuan.nosdn.127.net/c301559ba3ee280bcbf2fc4269bfa9ca.jpg\" style=\"\"/></p><p><img src=\"http://yanxuan.nosdn.127.net/573748f5c12ecb4515ba00a7b6e981dc.jpg\" _src=\"http://yanxuan.nosdn.127.net/573748f5c12ecb4515ba00a7b6e981dc.jpg\" style=\"\"/></p><p><img src=\"http://yanxuan.nosdn.127.net/27bcc8bf512a7e6f994a9683b3deea82.jpg\" _src=\"http://yanxuan.nosdn.127.net/27bcc8bf512a7e6f994a9683b3deea82.jpg\" style=\"\"/></p><p><img src=\"http://yanxuan.nosdn.127.net/e22a4507fd1e4b5ef859035e857ae419.jpg\" _src=\"http://yanxuan.nosdn.127.net/e22a4507fd1e4b5ef859035e857ae419.jpg\" style=\"\"/></p><p><img src=\"http://yanxuan.nosdn.127.net/27b07b4ca709c33ad71b368f87781307.jpg\" _src=\"http://yanxuan.nosdn.127.net/27b07b4ca709c33ad71b368f87781307.jpg\" style=\"\"/></p><p><img src=\"http://yanxuan.nosdn.127.net/ef31eb48bcb133728bffda7e1239b592.jpg\" _src=\"http://yanxuan.nosdn.127.net/ef31eb48bcb133728bffda7e1239b592.jpg\" style=\"\"/></p><p><img src=\"http://yanxuan.nosdn.127.net/5f49aaaca59c0733ec92f100d01bc0af.jpg\" _src=\"http://yanxuan.nosdn.127.net/5f49aaaca59c0733ec92f100d01bc0af.jpg\" style=\"\"/></p><p><img src=\"http://yanxuan.nosdn.127.net/818889261deb75044e1018ec53485d85.jpg\" _src=\"http://yanxuan.nosdn.127.net/818889261deb75044e1018ec53485d85.jpg\" style=\"\"/></p><p><img src=\"http://yanxuan.nosdn.127.net/200369f023243e2faeb18a2a0a352ef1.jpg\" _src=\"http://yanxuan.nosdn.127.net/200369f023243e2faeb18a2a0a352ef1.jpg\" style=\"\"/></p><p><br/></p>",
    },
    status: 'draft',
    goods_brief: '', // 商品卖点介绍
    name: '', // 商品标题
    goods_desc: '', // 商品详情
    content_short: '', // 文章摘要
    source_uri: '', // 文章外链
//    primary_pic_url: '', // 商品图片
    gallery: [{
      "name": "",
      "url": "http://yanxuan.nosdn.127.net/355efbcc32981aa3b7869ca07ee47dac.jpg"
    },
      {
        "name": "",
        "url": "http://yanxuan.nosdn.127.net/43e283df216881037b70d8b34f8846d3.jpg"
      },
      {
        "name": "",
        "url": "http://yanxuan.nosdn.127.net/12e41d7e5dabaf9150a8bb45c41cf422.jpg"
      },
      {
        "name": "",
        "url": "http://yanxuan.nosdn.127.net/5c1d28e86ccb89980e6054a49571cdec.jpg"
      }],
    source_name: '', // 文章外部作者
    display_time: undefined, // 前台展示时间
    id: undefined,
    specificationList: [
      {
        specification_id: 2,
        name: "规格",
        isShowValue: true,
        valueList: [
          {
            id: 1,
            goods_id: 1181000,
            specification_id: 2,
            value: "1.5m床垫*1+枕头*2",
            pic_url: "",
            name: "规格",
            isShow: false
          },
          {
            id: 2,
            goods_id: 1181000,
            specification_id: 2,
            value: "1.8m床垫*1+枕头*2",
            pic_url: "",
            name: "规格",
            isShow: false
          }
        ]
      },
      {
        specification_id: 1,
        name: "颜色",
        isShowValue: true, // 显示规格选项
        valueList: [
          {
            id: 3,
            goods_id: 1181000,
            specification_id: 1,
            value: "浅杏粉",
            pic_url: "http://yanxuan.nosdn.127.net/10022c73fa7aa75c2c0d736e96cc56d5.png?quality=90&thumbnail=200x200&imageView",
            name: "颜色",
            isShow: false
          },
          {
            id: 4,
            goods_id: 1181000,
            specification_id: 1,
            value: "玛瑙红",
            pic_url: "http://yanxuan.nosdn.127.net/29442127f431a1a1801c195905319427.png?quality=90&thumbnail=200x200&imageView",
            name: "颜色",
            isShow: false
          },
          {
            id: 5,
            goods_id: 1181000,
            specification_id: 1,
            value: "烟白灰",
            pic_url: "http://yanxuan.nosdn.127.net/36f64a7161b67e7fb8ea45be32ecfa25.png?quality=90&thumbnail=200x200&imageView",
            name: "颜色",
            isShow: false
          }
        ]
      }
    ],
    productList: [
      {
        "id": 1,
        "goods_id": 1181000,
        "goods_specification_ids": "1_5",
        "goods_sn": "Y100500",
        "goods_number": 3,
        "retail_price": 2500
      },
      {
        "id": 2,
        "goods_id": 1181000,
        "goods_specification_ids": "2_3",
        "goods_sn": "Y200300",
        "goods_number": 23,
        "retail_price": 2500
      },
      {
        "id": 5,
        "goods_id": 1181000,
        "goods_specification_ids": "1_3",
        "goods_sn": "Y100300",
        "goods_number": 2,
        "retail_price": 2000
      },
      {
        "id": 6,
        "goods_id": 1181000,
        "goods_specification_ids": "1_4",
        "goods_sn": "Y100400",
        "goods_number": 120,
        "retail_price": 3000
      },
      {
        "id": 3,
        "goods_id": 1181000,
        "goods_specification_ids": "2_4",
        "goods_sn": "Y200400",
        "goods_number": 2,
        "retail_price": 2400
      },
      {
        "id": 4,
        "goods_id": 1181000,
        "goods_specification_ids": "2_5",
        "goods_sn": "Y200400",
        "goods_number": 1,
        "retail_price": 2100
      }
    ],

    product_specs_prices: [], // 价格
    product_specs: [{ // old spec
      type: '颜色',
      isShowValue: false,
      children: [{value: '黑', isShow: false}, {value: '蓝', isShow: false}]
    },
      {
        type: '尺寸',
        isShowValue: false,
        children: [{value: '大', isShow: false}, {value: '中', isShow: false}]
      }
    ],

    productParamsForm: [{
      attribute_category: '家具',
      attribute_name: '涂漆',
      attribute_des: '环保涂漆',
      isVisible: false
    }, {
      attribute_category: '家具2',
      attribute_name: '涂漆2',
      attribute_des: '环保涂漆2',
      isVisible: false // 显示删除按钮
    }],
    platforms: ['a-platform'],
    comment_disabled: false
  }

  export default {
    name: 'articleDetail',
    components: {Tinymce, MDinput, Upload, UploadSingle, Multiselect, Sticky},
    props: {
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    mounted() {
      // get specs options
//      productSpecsOptions

      this.fetchSpecs()


      // 编辑商品渲染数据
      let specCombinations = this.specCombinations()
//     let myDefaultAddPrices = JSON.parse(JSON.stringify(this.defaultAddPrices));
      let myDefaultAddPrices = this.postForm.productList

      this.mySpecPrices(specCombinations, myDefaultAddPrices)
    },
    data() {
      const validateRequire = (rule, value, callback) => {
        if (value === '') {
          this.$message({
            message: rule.field + '为必传项',
            type: 'error'
          })
          callback(null)
        } else {
          callback()
        }
      }
      const validateSourceUri = (rule, value, callback) => {
        if (value) {
          if (validateURL(value)) {
            callback()
          } else {
            this.$message({
              message: '外链url填写不正确',
              type: 'error'
            })
            callback(null)
          }
        } else {
          callback()
        }
      }
      return {
        goodId: '',
        postForm: Object.assign({}, defaultForm),
        fetchSuccess: true,
        loading: false,
        visible2: false,
        setAttributeImg: false,
        isShow: false,
        isShowValue: false,
        disableValue: false,
        key: 1, // table key
        formTheadOptions: ['apple', 'banana', 'orange'],
        checkboxVal: ['apple', 'banana'], // checkboxVal
        formThead: ['apple', 'banana'],// 默认表头 Default header
        attributeParam: {
          attribute_category: '',
          attribute_name: '',
          attribute_des: ''
        },
        // 注意此项为数组 type Array
        originalPrices: [{
          marketPrice: 11340,
          advicePrice: 10440,
          store: 90,
        }],
        // 批量填写价格
        defaultAddPrices: {
          /*  marketPrice: 0,
           advicePrice: 0,
           store: 0*/
          "id": 1,
          "goods_id": 0,
//          "goods_specification_ids": "1_2",
          "goods_sn": "Y100500",
          "goods_number": 0,
          "retail_price": 0
        },
        categories: ['居家', '餐厨', '饮食', '配件', '服装', '杂货'],
        checkList: [],
        // 规格种类的数量
        typesLength: null,
        enableSpec: null,
        // from backend
        specs: [{
          type: '颜色',
          children: ['红', '蓝']
        },
          {
            type: '尺寸',
            children: ['大', '中']
          }
        ],
        specPrices: [
//          specs: ['蓝', '中'],
//        prices: {
//        marketPrice: 50,
//          advicePrice: 40,
//          store: 10
        ],
        newSpecName: ['', ''],
        productSpecsOptions: [
          {
            id: 1,
            name: '家具'
          }, {
            id: 2,
            name: '尺寸'
          }, {
            id: 3,
            name: '双皮奶'
          }, {
            id: 4,
            name: '蚵仔煎'
          }, {
            id: 5,
            name: '龙须面'
          }, {
            id: 6,
            name: '北京烤鸭'
          },
          {
            id: 7,
            name: '颜色'
          }],

        specValueOptions: [
          {
            "id": 3,
            "goods_id": 1181000,
            "specification_id": 1,
            "value": "浅杏粉",
            "pic_url": "http://yanxuan.nosdn.127.net/10022c73fa7aa75c2c0d736e96cc56d5.png?quality=90&thumbnail=200x200&imageView"
          },
          {
            "id": 4,
            "goods_id": 1181000,
            "specification_id": 1,
            "value": "玛瑙红",
            "pic_url": "http://yanxuan.nosdn.127.net/29442127f431a1a1801c195905319427.png?quality=90&thumbnail=200x200&imageView"
          },
          {
            "id": 5,
            "goods_id": 1181000,
            "specification_id": 1,
            "value": "烟白灰",
            "pic_url": "http://yanxuan.nosdn.127.net/36f64a7161b67e7fb8ea45be32ecfa25.png?quality=90&thumbnail=200x200&imageView"
          }
        ],
        userLIstOptions: [],
        platformsOptions: [
          {key: 'a-platform', name: 'a-platform'},
          {key: 'b-platform', name: 'b-platform'},
          {key: 'c-platform', name: 'c-platform'}
        ],
        rules: {
          name: [
            {required: true, message: '请输入商品标题', trigger: 'blur'},
            {min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur'}
          ],
          introduce: [
            {required: true, message: '请输入卖点介绍', trigger: 'blur'},
            {min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur'}
          ],
          region: [
            {required: true, message: '请选择活动区域', trigger: 'change'}
          ],
          date1: [
            {type: 'date', required: true, message: '请选择日期', trigger: 'change'}
          ],
          date2: [
            {type: 'date', required: true, message: '请选择时间', trigger: 'change'}
          ],
          type: [
            {type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change'}
          ],
          resource: [
            {required: true, message: '请选择活动资源', trigger: 'change'}
          ],
          desc: [
            {required: true, message: '请填写活动形式', trigger: 'blur'}
          ]

//
//        image_uri: [{ validator: validateRequire }],
//        title: [{ validator: validateRequire }],
//        content: [{ validator: validateRequire }],
//        source_uri: [{ validator: validateSourceUri, trigger: 'blur' }]
        }
      }
    },
    watch: {
      checkboxVal(valArr) {
        this.formThead = this.formTheadOptions.filter(i => valArr.indexOf(i) >= 0)
        this.key = this.key + 1// 为了保证table 每次都会重渲 In order to ensure the table will be re-rendered each time
      }
    },
    computed: {
      contentShortLength() {
        return this.postForm.content_short.length
      },
      // 表格数据
      tableData() {

        let arr = this.specPrices
        let tableData = {data: arr}
        return tableData
      },
      // 规格表头数据
      tableThead() {
        let specs = this.postForm.specificationList
        let arr = []
        for (let i = 0; i < specs.length; i++) {
          arr.push(specs[i].name)
        }
        return specs
      }
    },
    created() {
      if (this.isEdit) {
        alert(this.$route.query.id)
        this.goodId = this.$route.query.id
        this.fetchData()
      } else {
        this.postForm = Object.assign({}, defaultForm)
      }

// 规格
//      this.specs = this._specs
      this.specs = []
      this.specPrices = []

      if (this.specs.length == 0) {
        // 初始化规格数据
        let obj = {}
        obj.type = "";
        obj.children = []
        this.specs.push(obj)


        let _obj = [{}]
        _obj[0].goods_specification_ids = ''
        _obj[0].prices = {
          goods_number: 0,
          retail_price: 0,
          pic_url: ''
        }

        this.specPrices = _obj
      }
    },
    methods: {
      test() {
        console.log('fabu____________________________')
//        console.log(this.postForm)

        // 组合数据
        for(let i=0; i<this.specPrices.length; i++){
          for(let j=0; j<this.postForm.productList.length; j++){
            let specIdsArr = []
            for(let n=0; n<this.specPrices[i].specs.length; n++){
              specIdsArr.push(this.specPrices[i].specs[n].id)
            }
            if(specIdsArr.join('_')===this.postForm.productList[j].goods_specification_ids){
              this.postForm.productList[j].goods_number = this.specPrices[i].prices.goods_number
              this.postForm.productList[j].retail_price = this.specPrices[i].prices.retail_price
            }
          }

        }
        console.log(this.postForm)
        console.log(this.specPrices)
      },
      fetchSpecs() {
        getSpecifications({}).then(response => {
          this.productSpecsOptions = response.data.data
        })
      },
      fetchSpecsValue(specName) {

        let specId = ''
        for (let i = 0; i < this.productSpecsOptions.length; i++) {
          if (specName == this.productSpecsOptions[i].name) {
            specId = this.productSpecsOptions[i].id
          }
        }
        getSpecValue({specId: specId}).then(response => {

          this.specValueOptions = response.data.data
        })
      },
      fetchData() {
        /*fetchArticle().then(response => {
         this.postForm = response.data
         }).catch(err => {
         this.fetchSuccess = false
         console.log(err)
         })*/
      },
      submitForm() {
        this.postForm.display_time = parseInt(this.display_time / 1000)
        console.log(this.postForm)
        this.$refs.postForm.validate(valid => {
          if (valid) {
            this.loading = true
            this.$notify({
              title: '成功',
              message: '发布文章成功',
              type: 'success',
              duration: 2000
            })
            this.postForm.status = 'published'
            this.loading = false
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      draftForm() {
        if (this.postForm.content.length === 0 || this.postForm.title.length === 0) {
          this.$message({
            message: '请填写必要的标题和内容',
            type: 'warning'
          })
          return
        }
        this.$message({
          message: '保存成功',
          type: 'success',
          showClose: true,
          duration: 1000
        })
        this.postForm.status = 'draft'
      },
      getRemoteUserList(query) {
        userSearch(query).then(response => {
          if (!response.data.items) return
          console.log(response)
          this.userLIstOptions = response.data.items.map(v => ({
            key: v.name
          }))
        })
      },
      addProductSku() {
        let obj = {
          specification_id: '',
          name: "",
          isShowValue: false,
          valueList: []
        }


        this.postForm.specificationList.push(obj)

        let defaultAddPrices = {
          goods_number: 0,
          retail_price: 0,
          pic_url:''
        }


        // 每次点击添加, 保存一个defaultAddPrices的深拷贝副本, 防止数据关联
        let myDefaultAddPrices = JSON.parse(JSON.stringify(defaultAddPrices));
        let specCombinations = this.specCombinations()
        // 去更新价格数据

        this.mySpecPrices(specCombinations, myDefaultAddPrices)


        if (this.postForm.specificationList.length >= 3) {
          this.disableValue = true
        } else {
          this.disableValue = false
        }
      },
      addProductAttribute(row) {
        this.postForm.productParamsForm.push(this.attributeParam)
      },
      showPopover(index) {

      },
      deleteProductAttribute(index, rows) {

        rows.splice(index, 1);
        console.log(this.postForm.productParamsForm)

      },
      handleSelectionChange() {

      },
      handleCheckedCategoryChange() {

      },
      modiSpec(specName, spec, index) {
        spec[index] = specName;
        console.log(this.specs)
      },
      addSpec(spec, newSpecName, index, options, index2) {



//        let obj = {value: '', isShow: false}
        let obj = {
          isShow: false,
          id: 1,
          goods_id: '',
          specification_id: '',
          value: "",
          pic_url: "",
          name: ""
        }


        for (let i = 0; i < options.length; i++) {
          if (options[i].value === newSpecName) {
            obj = options[i]
          }
        }

        console.log('specs--------------')
        console.log(spec)


        console.log('newSpecName--------------')
        console.log(newSpecName)


        // 检测新规格名是否规范 1, 不为空. 2,不重复
        if (spec.length > 1) {
          for (let j = 0; j < spec.length - 1; j++) {
            if (spec[j].value === newSpecName.trim()) {
              this.$message({
                showClose: true,
                message: '规格项名称不能为重复!',
                type: 'warning'
              })
              spec[index2].value = '' // 清空
              return
            }
          }

        }
        spec[index2] = obj

        let defaultAddPrices = {
          goods_number: 0,
          retail_price: 0,
          pic_url:''
        }

        // 每次点击添加, 保存一个defaultAddPrices的深拷贝副本, 防止数据关联
        let myDefaultAddPrices = JSON.parse(JSON.stringify(defaultAddPrices));
        let specCombinations = this.specCombinations()
        // 去更新价格数据

        this.mySpecPrices(specCombinations, myDefaultAddPrices)

      },
      addSpecsValue(spec, newSpecName, index, options) {

        let obj = {
          isShow: false,
          id: 1,
          goods_id: '',
          specification_id: '',
          value: "",
          pic_url: "",
          name: ""
        }

        this.postForm.specificationList[index].valueList.push(obj)

      },
      // 删除规格表单
      removeSpecs(item) {


        let index = this.postForm.specificationList.indexOf(item)


        let defaultAddPrices = {
          goods_number: 0,
          retail_price: 0,
          pic_url: ''
        }

        if (index !== -1) {

          this.postForm.specificationList.splice(index, 1)
          console.log('删除后的-------------------------------------------------')
          console.log(this.postForm.specificationList)
          // 删除后重新渲染规格价格表单

          // 每次点击添加, 保存一个defaultAddPrices的深拷贝副本, 防止数据关联
          let myDefaultAddPrices = JSON.parse(JSON.stringify(defaultAddPrices));
          let specCombinations = this.specCombinations()
          // 去更新价格数据
          this.mySpecPrices(specCombinations, myDefaultAddPrices)

        }
        if (this.postForm.specificationList.length < 3) {
          this.disableValue = false
        } else {
          this.disableValue = true
        }
      },
      removeSpecValue(index, index2, specValue, options) {



        let defaultAddPrices = {
          goods_number: 0,
          retail_price: 0,
          pic_url: ''
        }

        this.postForm.specificationList[index].valueList.splice(index2, 1)
        // 每次点击添加, 保存一个defaultAddPrices的深拷贝副本, 防止数据关联
        let myDefaultAddPrices = JSON.parse(JSON.stringify(defaultAddPrices));
        let specCombinations = this.specCombinations()
        // 去更新价格数据
        this.mySpecPrices(specCombinations, myDefaultAddPrices)

      },
      toggleShow(index, index2) {
        this.postForm.specificationList[index].valueList[index2].isShow = !this.postForm.specificationList[index].valueList[index2].isShow
      },
      renderAddSpec(index, newSpecName) {

        // 验证重复的
        for (let j = 0; j < this.postForm.specificationList.length; j++) {
          if (this.postForm.specificationList[j].name === newSpecName.trim() && j != index) {

            this.$message({
              showClose: true,
              message: '规格属性名不能为重复!',
              type: 'warning'
            })
            this.postForm.specificationList[index].name = '' // 清空
            return
          }
        }


        console.log('specType: ' + newSpecName)
        this.postForm.specificationList[index].isShowValue = true
        this.postForm.specificationList[index].valueList.length = 0
        this.formThead.length = 0
        this.formThead.push(newSpecName)

//      渲染一个默认规格值输入框
        let obj = {
          isShow: false,
          id: 1,
          goods_id: '',
          specification_id: '',
          value: "",
          pic_url: "",
          name: ""
        }


        this.postForm.specificationList[index].valueList.push(obj)
        this.fetchSpecsValue(newSpecName)
      },
      // 规格组合数组
      specCombinations() {
        console.log(this.postForm.specificationList)
        let arrWra = [];
        // 有2个规格type  children: [{value: '红',isShow: false}, {value:'蓝', isShow: false}]
        if (this.postForm.specificationList.length == 3) {
          let arr1 = this.postForm.specificationList[0].valueList
          let arr2 = this.postForm.specificationList[1].valueList
          let arr3 = this.postForm.specificationList[2].valueList
          // 判断arr1是否为[], 如果是 为其添加个空字符串占位
          if (arr1.length == 0) {
            arr1 = [{id: '', name: ''}]
          }
          if (arr2.length == 0) {
            arr2 = [{id: '', name: ''}]
          }
          if (arr3.length == 0) {
            arr3 = [{id: '', name: ''}]
          }
          let arr = []

          for (let t = 0; t < arr1.length; t++) {
            for (let i = 0; i < arr2.length; i++) {
              for (let m = 0; m < arr3.length; m++) {
                arr = []
                arr.push({id: arr1[t].id, specValue: arr1[t].value})
                arr.push({id: arr2[i].id, specValue: arr2[i].value})
                arr.push({id: arr3[m].id, specValue: arr3[m].value})
                arrWra.push(arr)
              }

            }
          }
          console.log(arrWra)
          return arrWra
          // 只有1个规格type
        } else if (this.postForm.specificationList.length == 1) {
          let arr = this.postForm.specificationList[0].valueList
          if (arr.length == 0) {
            arr = [{id: '', name: ''}]
          }
          for (let i = 0; i < arr.length; i++) {
            let _arr = []
            _arr.push({id: arr[i].id, specValue: arr[i].value})
            arrWra.push(_arr)
          }

          console.log(arrWra)
          console.log('arrWra hehe............')
          return arrWra
        } else if (this.postForm.specificationList.length == 2) {
          let arr1 = this.postForm.specificationList[0].valueList
          let arr2 = this.postForm.specificationList[1].valueList
          // 判断arr1是否为[], 如果是 为其添加个空字符串占位
          if (arr1.length == 0) {
            arr1 = ['']
          }
          if (arr2.length == 0) {
            arr2 = ['']
          }
          let arr = []
          for (let t = 0; t < arr1.length; t++) {
            for (let i = 0; i < arr2.length; i++) {
              arr = []
              arr.push({id: arr1[t].id, specValue: arr1[t].value})
              arr.push({id: arr2[i].id, specValue: arr2[i].value})
              arrWra.push(arr)
            }
          }
          console.log('规格组合数组——————————————————')
          console.log(arrWra)
          return arrWra
        }
      },
      // 规格价格数据
      // 每次修改都需要数据更新
      mySpecPrices(specCombinations, myDefaultAddPrices) {
        debugger
        // specCombinations 规格组合数组，
        // myDefaultAddPrices 默认规格对应价格等参数
        // 编辑数据时候
        if (Array.isArray(myDefaultAddPrices)) {
          let arrWra = []
          // 规格组合 数组
          let arr = specCombinations
          for (let i = 0; i < arr.length; i++) {
            // 新增 规格价格 项
            let obj = {}
            obj.specs = arr[i]
            // 对比 新的 规格组合数组 与原价格数组
            let oldItem = this.specPrices.filter((element) => {
              let oldSpecIdArr = []
              for (let k = 0; k < arr[i].length; k++) {
                oldSpecIdArr.push(arr[i].id)
              }
              let specIds = element.goods_specification_ids
              let specIdArr = specIds.split('_')
              return oldSpecIdArr.sort().toString() == specIdArr.sort().toString()
            })
            let newItem = this.specPrices.filter((element) => {
              let oldSpecIdArr = [];
              for (let k = 0; k < arr[i].length; k++) {
                oldSpecIdArr.push(arr[i].id)
              }
              let specIds = element.goods_specification_ids
              let specIdArr = specIds.split('_')
              return oldSpecIdArr.sort().toString() != specIdArr.sort().toString()

            })
            // 注意这里用的是length因为 空数组,空对象的布尔值为true
            // 旧规各项价格
            if (oldItem.length) {
              obj.prices = oldItem[0].prices
              console.log(oldItem[0])
              // 新规各项价格
            } else {

              //  绑定规格价格
              let newSpecPrices = '';
              for (let x = 0; x < myDefaultAddPrices.length; x++) {
                let oldSpecIdArr = [];
                for (let k = 0; k < arr[i].length; k++) {
                  oldSpecIdArr.push(arr[i][k].id)
                }

                let specIds = myDefaultAddPrices[x].goods_specification_ids + ''
                let specIdArr = specIds.split('_')

                if (oldSpecIdArr.sort().toString() == specIdArr.sort().toString()) {
                  newSpecPrices = myDefaultAddPrices[x]
                }
              }

//               if (newItem.length != 0) {
//            这里用深拷贝否则各新项目的价格数据会关联
              newItem[0].prices = JSON.parse(JSON.stringify(newSpecPrices));
//              newItem[0].prices = newSpecPrices
              obj.prices = newItem[0].prices
//               }
            }
            arrWra.push(obj)
          }
          console.log('规格组合和价格拼接后～～～～～～～～～3333333～～～～～～～～～～～～')
          console.log(arrWra)
          this.specPrices = arrWra


          // 组合成后台接口使用的数据productList
          let newProductList = []
          for (let i = 0; i <  this.specPrices.length; i++) {
            let item = {
              goods_specification_ids: '',
              goods_number: '',
              retail_price: ''
            }
            item.goods_number =  this.specPrices[i].prices.goods_number
            item.retail_price =  this.specPrices[i].prices.retail_price
            let idsArr = []
            for (let n = 0; n <  this.specPrices[i].specs.length; n++) {
              idsArr.push( this.specPrices[i].specs[n].id)
              item.goods_specification_ids = idsArr.join('_')
            }
            newProductList.push(item)
          }

          this.postForm.productList = newProductList


        } else {

          let arrWra = []
          // 规格组合 数组
          let arr = specCombinations
          for (let i = 0; i < arr.length; i++) {

            // 新增 规格价格 项
            let obj = {};
            obj.specs = arr[i];
            // !注意 a类型为数组
            // 对比 新的 规格组合数组 与原价格数组
            let oldItem = this.specPrices.filter((element) => {
              return element.specs + "" == arr[i] + "";
            })
            let newItem = this.specPrices.filter((element) => {

              return element.specs + "" != arr[i] + "";
            })
            // 注意这里用的是length因为 空数组,空对象的布尔值为true
            // 旧规各项价格
            if (oldItem.length) {
              obj.prices = JSON.parse(JSON.stringify(oldItem[0].prices))
              // 新规各项价格
            } else {
              console.log(newItem)
              console.log('_____')
              // if (newItem.length != 0) {
              // 这里用深拷贝否则各新项目的价格数据会关联
              newItem[0].prices = JSON.parse(JSON.stringify(myDefaultAddPrices));
              obj.prices = newItem[0].prices
              // }
            }
            arrWra.push(obj)
          }
          console.log('规格组合和价格拼接后～～～～～～～～～～～～～～～～～～～～～')
          console.log(arrWra)
          this.specPrices = arrWra

          // 组合成后台接口使用的数据productList

          let newProductList = []
          for (let i = 0; i <  this.specPrices.length; i++) {
            let item = {
              goods_specification_ids: '',
              goods_number: '',
              retail_price: ''
            }
            item.goods_number =  this.specPrices[i].prices.goods_number
            item.retail_price =  this.specPrices[i].prices.retail_price
            let idsArr = []
            for (let n = 0; n <  this.specPrices[i].specs.length; n++) {
              idsArr.push( this.specPrices[i].specs[n].id)
              item.goods_specification_ids = idsArr.join('_')
            }
            newProductList.push(item)
          }

          console.log('newProductlist：')
          console.log(newProductList)
          this.postForm.productList = newProductList



          console.log('添加后前~~~~~~~~~~~~~~~~~~~~~')
          console.log(this.postForm)
        }


        // console.log('规格组合和价格拼接后～～～～～～～～～～～～～～～～～～～～～')
        //console.log(arrWra)
//        this.specPrices = arrWra
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";

  .title-prompt {
    position: absolute;
    right: 0;
    font-size: 12px;
    top: 10px;
    color: #ff4949;
  }

  .createPost-container {
    position: relative;
    .createPost-main-container {
      padding: 40px 45px 20px 50px;
      .postInfo-container {
        position: relative;
        @include clearfix;
        margin-bottom: 10px;
        .postInfo-container-item {
          float: left;
        }
      }
      .editor-container {
        min-height: 500px;
        margin: 0 0 30px;
        .editor-upload-btn-container {
          text-align: right;
          margin-right: 10px;
          .editor-upload-btn {
            display: inline-block;
          }
        }
      }
      .form_divider {
        border-top: 1px solid #c5c5c5;
        margin: 15px 0;
      }
    }
    .word-counter {
      width: 40px;
      position: absolute;
      right: -10px;
      top: 0;
    }
  }

  .delete-spec {
    position: relative;
    top: -64px;
    cursor: pointer;
  }

  .delete-spec-box {
    font-size: 20px;
    cursor: pointer;
    float: right;
  }

</style>
