from faker import Faker
from kafka import KafkaProducer
import json
import time

fake = Faker()

def get_registered_user():
    return {
        "name": fake.name(),
        "email": fake.email(),
        "age": fake.year(),
        "address": fake.address(),
        "authorEmail": fake.email(),
    }

def json_serializer(data):
    return json.dumps(data).encode("utf-8")

producer = KafkaProducer(
    bootstrap_servers=["localhost:9092"],
    value_serializer=json_serializer,
    linger_ms=5,
    batch_size=16384,
)

if __name__ == "__main__":
    try:
        while True:
            registered_user = get_registered_user()
            print(registered_user)
            producer.send("form_saved", registered_user)
            producer.flush()
            time.sleep(1)
    except KeyboardInterrupt:
        pass
    finally:
        producer.close()
