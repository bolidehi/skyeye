/*******************************************************************************
 * Copyright 卫志强 QQ：598748873@qq.com Inc. All rights reserved. 开源地址：https://gitee.com/doc_wei01/skyeye
 ******************************************************************************/

package com.skyeye.service;

import com.skyeye.common.object.InputObject;
import com.skyeye.common.object.OutputObject;

/**
 * @ClassName: BossIntervieweeFromService
 * @Description: 面试者来源管理服务接口层
 * @author: skyeye云系列--卫志强
 * @date: 2021/11/7 13:29
 * @Copyright: 2021 https://gitee.com/doc_wei01/skyeye Inc. All rights reserved.
 * 注意：本内容仅限购买后使用.禁止私自外泄以及用于其他的商业目的
 */
public interface BossIntervieweeFromService {

    /**
     * 分页+title模糊查询动态表单页面分类列表
     *
     * @param inputObject
     * @param outputObject
     */
    void queryBossIntervieweeFromList(InputObject inputObject, OutputObject outputObject) throws Exception;

    /**
     * 新增面试者来源信息
     *
     * @param inputObject
     * @param outputObject
     */
    void insertBossIntervieweeFrom(InputObject inputObject, OutputObject outputObject) throws Exception;

    /**
     * 根据id查询面试者来源信息详情
     *
     * @param inputObject
     * @param outputObject
     */
    void queryBossIntervieweeFromById(InputObject inputObject, OutputObject outputObject) throws Exception;

    /**
     * 根据id更新面试者来源信息
     *
     * @param inputObject
     * @param outputObject
     */
    void updateBossIntervieweeFromById(InputObject inputObject, OutputObject outputObject) throws Exception;

    /**
     * 根据id删除面试者来源信息
     *
     * @param inputObject
     * @param outputObject
     */
    void delBossIntervieweeFromById(InputObject inputObject, OutputObject outputObject) throws Exception;
}
