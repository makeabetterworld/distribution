<template>
  <div class="home-page">
    <!-- 头部导航 -->
    <header class="header">
      <div class="header-content">
        <div class="logo">
          <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2307c160'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z'/%3E%3C/svg%3E" alt="logo" />
          <span>分销系统</span>
        </div>
        <div class="header-actions">
          <a-button type="link" @click="$router.push('/login')">登录</a-button>
          <a-button type="primary" @click="$router.push('/register')">免费注册</a-button>
        </div>
      </div>
    </header>

    <!-- Hero 区域 -->
    <section class="hero">
      <div class="hero-content">
        <h1>开启您的分销事业</h1>
        <p class="hero-desc">零门槛入驻，丰厚佣金回报，让每一次传播都有价值</p>
        <div class="hero-actions">
          <a-button type="primary" size="large" @click="$router.push('/register')">
            立即加入
          </a-button>
          <a-button size="large" @click="scrollToSection('features')">
            了解更多
          </a-button>
        </div>
      </div>
      <div class="hero-illustration">
        <div class="illustration-card">
          <div class="stat-item">
            <div class="stat-value">60%</div>
            <div class="stat-label">最高佣金比例</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">24h</div>
            <div class="stat-label">快速提现到账</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">¥800</div>
            <div class="stat-label">平均日收益</div>
          </div>
        </div>
      </div>
    </section>

    <!-- 业务介绍 -->
    <section id="features" class="features">
      <h2 class="section-title">赚钱从来没有现在如此简单？</h2>
      <p class="section-desc">全网唯一的影片分享平台，刚刚推出，此时不抢占先机，更待何时！</p>

      <div class="feature-grid">
        <div class="feature-card">
          <div class="feature-icon">📱</div>
          <h3>一键分享</h3>
          <p>生成专属站点推广链接和二维码，轻松分享给好友</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">💰</div>
          <h3>丰厚佣金</h3>
          <p>一级分销 60%、二级 6%、三级 4%，多层级收益</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">📊</div>
          <h3>数据看板</h3>
          <p>实时查看订单、收益、提现等详细数据</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🚀</div>
          <h3>快速提现</h3>
          <p>支持支付宝提现，审核通过后快速到账</p>
        </div>
      </div>
    </section>

    <!-- 分成体系 -->
    <section class="commission">
      <h2 class="section-title">分成体系</h2>
      <p class="section-desc">三级分销模式，层层收益</p>

      <div class="commission-levels">
        <div class="level-card level-1">
          <div class="level-badge">一级分销</div>
          <div class="level-rate">60%</div>
          <div class="level-desc">站点有会员消费，您获得到账金额的 60% 作为佣金</div>
          <div class="level-example">例：会员消费到账$100，您获得$60</div>
        </div>
        <div class="level-card level-2">
          <div class="level-badge">二级分销</div>
          <div class="level-rate">6%</div>
          <div class="level-desc">通过你的站点新开站点有会员消费，您获得到账金额的 6% 作为佣金</div>
          <div class="level-example">例：间接会员消费到账$100，您获得$6</div>
        </div>
        <div class="level-card level-3">
          <div class="level-badge">三级分销</div>
          <div class="level-rate">4%</div>
          <div class="level-desc">第三层站点会员消费，您获得到账金额的 4% 作为佣金</div>
          <div class="level-example">例：第三层站点会员消费$100，您获得$4</div>
        </div>
      </div>
    </section>

    <!-- 提现方法 -->
    <section class="withdraw">
      <h2 class="section-title">如何提现？</h2>
      <p class="section-desc">简单三步，轻松提现</p>

      <div class="withdraw-steps">
        <div class="step">
          <div class="step-number">1</div>
          <div class="step-title">绑定支付宝</div>
          <div class="step-desc">在站点管理中填写支付宝账号信息</div>
        </div>
        <div class="step">
          <div class="step-number">2</div>
          <div class="step-title">申请提现</div>
          <div class="step-desc">输入提现金额，最低提现$30</div>
        </div>
        <div class="step">
          <div class="step-number">3</div>
          <div class="step-title">等待审核</div>
          <div class="step-desc">审核通过后 24 小时内到账</div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta">
      <h2>准备好开始了吗？</h2>
      <p>立即注册，开启您的分销赚钱之旅</p>
      <a-button type="primary" size="large" @click="$router.push('/register')">
        免费注册
      </a-button>
    </section>

    <!-- 页脚 -->
    <footer class="footer">
      <p>© 2026 分销系统 版权所有</p>
    </footer>
  </div>
</template>

<script setup>
const scrollToSection = (id) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.header {
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 20px;
  font-weight: 600;
  color: #07c160;
}

.logo img {
  width: 36px;
  height: 36px;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.header-actions :deep(.ant-btn-primary) {
  background: #07c160;
}

.hero {
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 24px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
}

.hero-content h1 {
  font-size: 48px;
  font-weight: 700;
  color: #111;
  margin: 0 0 16px;
  line-height: 1.2;
}

.hero-desc {
  font-size: 18px;
  color: #666;
  margin: 0 0 32px;
}

.hero-actions {
  display: flex;
  gap: 16px;
}

.hero-actions :deep(.ant-btn-primary) {
  background: #07c160;
  height: 48px;
  font-size: 16px;
}

.illustration-card {
  background: linear-gradient(135deg, #07c160 0%, #06ad56 100%);
  border-radius: 24px;
  padding: 40px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  box-shadow: 0 20px 40px rgba(7, 193, 96, 0.3);
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 36px;
  font-weight: 700;
  color: #fff;
}

.stat-label {
  color: rgba(255, 255, 255, 0.9);
  margin-top: 8px;
}

.section-title {
  font-size: 32px;
  font-weight: 600;
  text-align: center;
  margin: 0 0 8px;
}

.section-desc {
  font-size: 16px;
  color: #666;
  text-align: center;
  margin: 0 0 40px;
}

.features,
.commission,
.withdraw {
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 24px;
}

.features {
  background: #fff;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.feature-card {
  background: #f9f9f9;
  border-radius: 16px;
  padding: 32px 24px;
  text-align: center;
  transition: transform 0.3s, box-shadow 0.3s;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.feature-card h3 {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 12px;
  color: #111;
}

.feature-card p {
  font-size: 14px;
  color: #666;
  margin: 0;
  line-height: 1.6;
}

.commission-levels {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.level-card {
  background: #fff;
  border-radius: 16px;
  padding: 32px 24px;
  text-align: center;
  border: 2px solid #f0f0f0;
  transition: border-color 0.3s, transform 0.3s;
}

.level-card:hover {
  transform: translateY(-4px);
}

.level-1 { border-color: #ffd700; }
.level-2 { border-color: #c0c0c0; }
.level-3 { border-color: #cd7f32; }

.level-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  margin-bottom: 16px;
}

.level-1 .level-badge { background: #ffd700; color: #333; }
.level-2 .level-badge { background: #c0c0c0; color: #333; }
.level-3 .level-badge { background: #cd7f32; color: #fff; }

.level-rate {
  font-size: 48px;
  font-weight: 700;
  color: #07c160;
  margin-bottom: 16px;
}

.level-desc {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 12px;
}

.level-example {
  font-size: 13px;
  color: #999;
  background: #f9f9f9;
  padding: 12px;
  border-radius: 8px;
}

.withdraw {
  background: #fff;
}

.withdraw-steps {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
}

.step {
  text-align: center;
}

.step-number {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #07c160 0%, #06ad56 100%);
  color: #fff;
  font-size: 20px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
}

.step-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 8px;
}

.step-desc {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.cta {
  background: linear-gradient(135deg, #07c160 0%, #06ad56 100%);
  text-align: center;
  padding: 80px 24px;
}

.cta h2 {
  font-size: 32px;
  font-weight: 600;
  color: #fff;
  margin: 0 0 12px;
}

.cta p {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 32px;
}

.cta :deep(.ant-btn-primary) {
  background: #fff;
  color: #07c160;
  height: 48px;
  font-size: 16px;
}

.footer {
  background: #1a1a1a;
  text-align: center;
  padding: 24px;
  color: #666;
}

/* 移动端响应式 */
@media (max-width: 768px) {
  .header-content {
    padding: 12px 16px;
  }

  .logo span {
    font-size: 16px;
  }

  .logo img {
    width: 28px;
    height: 28px;
  }

  .header-actions :deep(.ant-btn) {
    padding: 4px 12px;
    font-size: 14px;
  }

  .hero {
    padding: 40px 16px;
    grid-template-columns: 1fr;
    gap: 32px;
  }

  .hero-content h1 {
    font-size: 28px;
  }

  .hero-desc {
    font-size: 15px;
  }

  .hero-actions {
    flex-direction: column;
    gap: 12px;
  }

  .hero-actions :deep(.ant-btn) {
    height: 42px;
    font-size: 15px;
    width: 100%;
  }

  .illustration-card {
    padding: 24px;
  }

  .stat-value {
    font-size: 28px;
  }

  .section-title {
    font-size: 22px;
  }

  .section-desc {
    font-size: 14px;
    margin: 0 0 24px;
  }

  .features,
  .commission,
  .withdraw {
    padding: 40px 16px;
  }

  .feature-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .feature-card {
    padding: 20px 16px;
  }

  .feature-icon {
    font-size: 36px;
    margin-bottom: 12px;
  }

  .feature-card h3 {
    font-size: 15px;
    margin-bottom: 8px;
  }

  .feature-card p {
    font-size: 13px;
  }

  .commission-levels {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .level-card {
    padding: 20px 16px;
  }

  .level-rate {
    font-size: 36px;
  }

  .level-desc {
    font-size: 13px;
  }

  .level-example {
    font-size: 12px;
    padding: 10px;
  }

  .withdraw-steps {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .cta {
    padding: 40px 16px;
  }

  .cta h2 {
    font-size: 22px;
  }

  .cta p {
    font-size: 14px;
    margin: 0 0 24px;
  }

  .cta :deep(.ant-btn) {
    height: 42px;
    font-size: 15px;
    width: 100%;
  }

  .footer {
    padding: 16px;
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .feature-grid {
    grid-template-columns: 1fr;
  }

  .stat-value {
    font-size: 24px;
  }
}
</style>
