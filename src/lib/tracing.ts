import { NodeSDK } from "@opentelemetry/sdk-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { ExpressInstrumentation } from "@opentelemetry/instrumentation-express";
import { HttpInstrumentation } from "@opentelemetry/instrumentation-http";
import { diag, DiagConsoleLogger, DiagLogLevel } from "@opentelemetry/api";
//opentelemetry SDK와 익스포터, Express/HTTP 자동 계측기, 로깅 유팅을 가져옴

// 디버깅 용 로거 선택
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);
// OpenTelemetry 내부 로그를 콘솔에 출력하게 설정함
// INFO 수준 이상의 로그만 출력

//OTLP 트레이스 익스포터 설정(Tempo가 수신)
const traceExporter = new OTLPTraceExporter({
  url: "http://localhost:4319/v1/traces", // default collector 엔드포인트
});
/* OTLP Trace Exporter 생성
Tempo와 통신할 OTLP exporter 인스턴스 생성
Tempo가 OTLP 수신 포트를 열고 있다면 여기로 trace가 전송됨
URL은 Tempo의 Collector 엔드포인트 (4318 번 포트, /v1/traces 경로)*/

//SDK 초기화
const sdk = new NodeSDK({
  traceExporter,
  serviceName: "my-express-app", // 서비스 이름 정의
  instrumentations: [new HttpInstrumentation(), new ExpressInstrumentation()],
});
/* NodeSDK는 OpenTelemetry 전체 설정을 대표하는 객체
인자로 다음을 넘겨줌
  traceExporter: 위에서 만든 OTLP 익스포터
  serviceName: 이 서비스의 이름. Tempo/Grafana에서 이 이름으로 표시됨
  instrumentations: Express/HTTP 자동 추적 계측 (자동으로 request/response trace 생성) */

async function initOpenTelemetry() {
  try {
    await sdk.start();
    console.log("OpenTelemetry initialized");
  } catch (error: unknown) {
    console.log("Error initalizing openTelemetry SDK", error);
  }
}
/* 초기화 함수 정의
SDK를 시작하고 오류를 핸들링함.
sdk.start()는 비동기함수라 await 필요
실패 시 오류 출력 */

initOpenTelemetry();
/* 초기화 함수 호출
프로그램 시작 시 OpenTelemetry도 같이 시작됨 */

//SIGTERM 처리
process.on("SIGTERM", () => {
  sdk.shutdown().then(() => console.log("OpenTelementry SDK shut down"));
});
/* 종료 시 처리
서버가 종료될 때(SIGTERM(종료 신호) 시그널 수신), SDK를 정리 함

강제로 종료되면 아직 전송되지 않은 trace 정보들이 유실될 수 있음 그래서 sigterm 이벤트를 감지해서
정리 작업을 하고 나서 종료하는게 중요하다.*/
