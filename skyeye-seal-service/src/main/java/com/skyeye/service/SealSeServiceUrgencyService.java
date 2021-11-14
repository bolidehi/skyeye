/*******************************************************************************
 * Copyright 卫志强 QQ：598748873@qq.com Inc. All rights reserved. 开源地址：https://gitee.com/doc_wei01/skyeye
 ******************************************************************************/
package com.skyeye.service;

import com.skyeye.common.object.InputObject;
import com.skyeye.common.object.OutputObject;

public interface SealSeServiceUrgencyService {

    public void insertSealSeServiceUrgency(InputObject inputObject, OutputObject object) throws Exception;

    public void querySealSeServiceUrgencyList(InputObject inputObject, OutputObject outputObject) throws Exception;

    public void queryStateUpList(InputObject inputObject, OutputObject outputObject) throws Exception;

    public void editSealSeServiceUrgencyById(InputObject inputObject, OutputObject outputObject) throws Exception;

    public void editStateUpById(InputObject inputObject, OutputObject outputObject) throws Exception;

    public void editStateDownById(InputObject inputObject, OutputObject outputObject) throws Exception;

    public void deleteSealSeServiceUrgencyById(InputObject inputObject, OutputObject outputObject) throws Exception;

    public void querySealSeServiceUrgencyMationById(InputObject inputObject, OutputObject outputObject) throws Exception;

}