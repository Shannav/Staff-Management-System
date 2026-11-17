import logging
import signal
import threading

import redis

from retailvision.core.config import get_settings

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
logger = logging.getLogger(__name__)
shutdown = threading.Event()


def stop_worker(_signum: int, _frame: object) -> None:
    shutdown.set()


def main() -> None:
    settings = get_settings()
    client = redis.Redis.from_url(settings.redis_url, socket_connect_timeout=5)
    client.ping()
    logger.info("Worker online; waiting for camera support in Phase 3")
    signal.signal(signal.SIGTERM, stop_worker)
    signal.signal(signal.SIGINT, stop_worker)
    shutdown.wait()
    client.close()


if __name__ == "__main__":
    main()
