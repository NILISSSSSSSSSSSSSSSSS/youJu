DES=""
TARGET=""

promp:
	@echo "usage: make dev/beta/pro"

dev:
	@echo "make dev ..." ;\
	rm -r utils/config.js; \
	cp utils/config.dev.js utils/config.js; \
	chmod 777 utils/config.js -R;

beta:
	@echo "make beta ..." ;\
  	rm -r utils/config.js; \
  	cp utils/config.beta.js utils/config.js; \
  	chmod 777 utils/config.js -R;

pro:
	@echo "make pro ..." ;\
  	rm -r utils/config.js; \
  	cp utils/config.pro.js utils/config.js; \
  	chmod 777 utils/config.js -R;

project:
	@echo "make project ..." ;\
  	cp unpackage/dist/dev/mp-weixin/project.config.json static/h5/project.config.json; \
  	chmod 777 static/h5/project.config.json -R;

mv_project:
	@echo "make project ..." ;\
  	cp static/h5/project.config.json unpackage/dist/dev/mp-weixin/project.config.json; \
  	chmod 777 unpackage/dist/dev/mp-weixin/project.config.json -R;

