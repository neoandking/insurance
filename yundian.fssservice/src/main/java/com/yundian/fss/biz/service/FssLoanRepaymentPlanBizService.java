package com.yundian.fss.biz.service;

import com.yundian.fssapi.domain.FssLoanRepaymentPlanModel;

/**
 * @author jnx
 * @create 2018/6/22
 */
public interface FssLoanRepaymentPlanBizService {

    int updateRepaymentPlanPaymenting(Long planId);
    int updateRepaymentPlanUnPayment(Long planId);


    void repaymentSuccess(Long planId,Integer payAmount,String repaymentDate,String repaymentTime);

    void repaymentFailed(Long planId);

    void repaymentRefund(Long planId);
}
