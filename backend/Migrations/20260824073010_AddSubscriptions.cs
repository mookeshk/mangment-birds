using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddSubscriptions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ActivePackageId",
                table: "AspNetUsers",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "SubscriptionEndDate",
                table: "AspNetUsers",
                type: "datetime2",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "SubscriptionPackages",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Price = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    DurationMonths = table.Column<int>(type: "int", nullable: false),
                    Features = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SubscriptionPackages", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "SubscriptionRequests",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    PackageId = table.Column<int>(type: "int", nullable: false),
                    ReceiptUrl = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    RequestDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SubscriptionRequests", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SubscriptionRequests_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SubscriptionRequests_SubscriptionPackages_PackageId",
                        column: x => x.PackageId,
                        principalTable: "SubscriptionPackages",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUsers_ActivePackageId",
                table: "AspNetUsers",
                column: "ActivePackageId");

            migrationBuilder.CreateIndex(
                name: "IX_SubscriptionRequests_PackageId",
                table: "SubscriptionRequests",
                column: "PackageId");

            migrationBuilder.CreateIndex(
                name: "IX_SubscriptionRequests_UserId",
                table: "SubscriptionRequests",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUsers_SubscriptionPackages_ActivePackageId",
                table: "AspNetUsers",
                column: "ActivePackageId",
                principalTable: "SubscriptionPackages",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUsers_SubscriptionPackages_ActivePackageId",
                table: "AspNetUsers");

            migrationBuilder.DropTable(
                name: "SubscriptionRequests");

            migrationBuilder.DropTable(
                name: "SubscriptionPackages");

            migrationBuilder.DropIndex(
                name: "IX_AspNetUsers_ActivePackageId",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "ActivePackageId",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "SubscriptionEndDate",
                table: "AspNetUsers");
        }
    }
}
