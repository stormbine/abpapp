var About = { 
	template: `
        <div class="container">
            <div class="row">
                <div class="col-12">
                    <h1>About</h1>
                    <p>This is about page</p>

                    {{ sample_variable }}

                    <div @click="testClick()">and click here</div>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            sample_variable: "this is test content",
        }
    },
    methods: {
        testClick: function() {
            this.sample_variable = "and now its different"
        }
    }
};